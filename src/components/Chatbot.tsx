import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { Interest } from '../data/interests'
import { plannedSessionIds } from '../data/mine'
import { rooms } from '../data/rooms'
import { sessions } from '../data/sessions'
import { getPeople } from '../lib/people'
import type { Route } from '../lib/route'
import { buildChatKnowledge } from '../lib/chatKnowledge'

type ReferenceKind = 'session' | 'room' | 'person' | 'program' | 'my'

interface ChatReference {
  kind: ReferenceKind
  id: string
  title: string
  note: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  references?: ChatReference[]
}

interface ApiReply {
  answer: string
  references?: Array<{ kind: ReferenceKind; id: string; title?: string; note?: string }>
  mode?: 'live' | 'demo'
  model?: string
}

const suggestions = [
  '周一 9 点有哪些 session？',
  '我关注 accessibility，推荐看什么？',
  '哪些房间更安静、无障碍？',
  'Mina Patel 还出现在哪些论文里？',
]

const people = getPeople(sessions)

function referenceRoute(reference: ChatReference): Route | null {
  if (reference.kind === 'session') return { view: 'session', id: reference.id }
  if (reference.kind === 'room') return { view: 'map', room: reference.id }
  if (reference.kind === 'person') return { view: 'people', person: reference.id }
  if (reference.kind === 'program') return { view: 'program' }
  if (reference.kind === 'my') return { view: 'my' }
  return null
}

function resolveReferences(items: ApiReply['references']): ChatReference[] {
  if (!items) return []
  const resolved: ChatReference[] = []
  for (const item of items) {
    if (item.kind === 'session') {
      const session = sessions.find((entry) => entry.id === item.id)
      if (session) resolved.push({ kind: item.kind, id: session.id, title: session.title, note: `${session.startTime} · ${session.room}` })
    }
    if (item.kind === 'room' && item.id in rooms) {
      resolved.push({ kind: item.kind, id: item.id, title: item.id, note: 'Open in Map' })
    }
    if (item.kind === 'person' && people.includes(item.id)) {
      resolved.push({ kind: item.kind, id: item.id, title: item.id, note: 'Open in People' })
    }
    if (item.kind === 'program') resolved.push({ kind: item.kind, id: 'program', title: 'Program', note: 'Browse all sessions' })
    if (item.kind === 'my') resolved.push({ kind: item.kind, id: 'my', title: 'My', note: 'Open your plan and saved papers' })
  }
  return resolved.slice(0, 4)
}

function localAnswer(question: string): ApiReply {
  const query = question.toLowerCase()
  const tokens = query.split(/[^a-z0-9\u4e00-\u9fff]+/).filter((token) => token.length > 1)

  if ((/周一|monday/.test(query)) && /9(?::00)?\s*(点|am)?/.test(query)) {
    const matches = sessions.filter((session) => session.date === '2027-05-10' && session.startTime === '9:00 AM')
    const planned = matches.find((session) => plannedSessionIds.includes(session.id))
    return {
      answer: `周一上午 9:00 有 ${matches.length} 场：${matches.map((session) => `${session.title}（${session.room}）`).join('；')}。${planned ? `你的 My 计划里已有 ${planned.title}，所以另一场与它时间冲突。` : ''}`,
      references: matches.map((session) => ({ kind: 'session' as const, id: session.id })),
      mode: 'demo',
    }
  }

  const ranked = sessions
    .map((session) => {
      const haystack = [
        session.title,
        session.description,
        session.room,
        session.date,
        ...session.keywords,
        ...session.contents.flatMap((content) => [content.title, ...content.authors, ...content.keywords]),
      ].join(' ').toLowerCase()
      return { session, score: tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0) }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  if (/安静|quiet|sensory|无障碍|step.?free|accessible/.test(query)) {
    const matchingRooms = Object.entries(rooms)
      .filter(([, room]) => room.sensoryFriendly || room.stepFree)
      .slice(0, 4)
    return {
      answer: `站内房间数据里，${matchingRooms.map(([name]) => name).join('、')} 标记了感官友好或无台阶通行。你可以打开 Map 查看具体条件。`,
      references: matchingRooms.map(([id]) => ({ kind: 'room' as const, id })),
      mode: 'demo',
    }
  }

  const top = ranked.slice(0, 3)
  if (top.length) {
    return {
      answer: `我在站内资料中找到 ${ranked.length} 个相关 session。最相关的是 ${top.map(({ session }) => session.title).join('、')}。打开下面的来源可以查看时间、房间和论文。`,
      references: top.map(({ session }) => ({ kind: 'session' as const, id: session.id })),
      mode: 'demo',
    }
  }

  return {
    answer: '我暂时没在这个 CHI 原型的站内资料中找到对应信息。可以换成 session、论文作者、房间、时间或你的收藏来问我。',
    references: [{ kind: 'program', id: 'program' }],
    mode: 'demo',
  }
}

function AssistantMark() {
  return (
    <span className="assistant-mark" aria-hidden="true">
      <i /><i /><i />
    </span>
  )
}

export function Chatbot({ interests, onGo }: { interests: Interest[]; onGo: (route: Route) => void }) {
  const [open, setOpen] = useState(true)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [apiState, setApiState] = useState<'checking' | 'live' | 'demo'>('checking')
  const [model, setModel] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '你好，我是 Ask CHI。你可以问我站内的 session、论文、作者、时间、房间，也可以让我结合你的兴趣和已保存内容来比较。',
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const knowledge = useMemo(() => buildChatKnowledge(interests), [interests])

  useEffect(() => {
    fetch('/api/chat')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((status: { configured?: boolean; model?: string }) => {
        setApiState(status.configured ? 'live' : 'demo')
        setModel(status.model ?? '')
      })
      .catch(() => setApiState('demo'))
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: pending ? 'smooth' : 'auto' })
  }, [messages, pending])

  async function ask(rawQuestion: string) {
    const question = rawQuestion.trim()
    if (!question || pending) return
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', text: question }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setPending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.slice(-8).map(({ role, text }) => ({ role, text })),
          knowledge,
        }),
      })
      if (!response.ok) throw new Error('AI endpoint unavailable')
      const reply = await response.json() as ApiReply
      setApiState(reply.mode === 'live' ? 'live' : 'demo')
      setModel(reply.model ?? model)
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: reply.answer,
        references: resolveReferences(reply.references),
      }])
    } catch {
      const reply = localAnswer(question)
      setApiState('demo')
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: reply.answer,
        references: resolveReferences(reply.references),
      }])
    } finally {
      setPending(false)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void ask(input)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void ask(input)
    }
  }

  const followReference = (reference: ChatReference) => {
    const route = referenceRoute(reference)
    if (route) onGo(route)
    if (window.innerWidth < 720) setOpen(false)
  }

  return (
    <>
      <button type="button" className={`chat-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="ask-chi-panel">
        <AssistantMark />
        <span>{open ? 'Close' : 'Ask CHI'}</span>
      </button>

      <aside id="ask-chi-panel" className={`chat-panel ${open ? 'is-open' : ''}`} aria-label="Ask CHI chatbot" aria-hidden={!open}>
        <header className="chat-header">
          <div>
            <span className="chat-kicker">Program assistant</span>
            <h2><AssistantMark /> Ask CHI</h2>
          </div>
          <div className={`api-status is-${apiState}`} title={model || undefined}>
            <span /> {apiState === 'checking' ? 'Checking API' : apiState === 'live' ? 'Live AI' : 'Demo mode'}
          </div>
          <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close Ask CHI">×</button>
        </header>

        <div className="chat-context" aria-label="Assistant scope">
          <span><b>{sessions.length}</b> sessions</span>
          <span><b>{sessions.reduce((count, session) => count + session.contents.length, 0)}</b> papers</span>
          <span><b>{Object.keys(rooms).length}</b> rooms</span>
          <span><b>{plannedSessionIds.length}</b> planned</span>
        </div>

        <div className="chat-log" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className={`chat-message is-${message.role}`}>
              <span className="message-role">{message.role === 'assistant' ? 'Ask CHI' : 'You'}</span>
              <p>{message.text}</p>
              {!!message.references?.length && (
                <div className="chat-references" aria-label="Sources in this site">
                  {message.references.map((reference) => (
                    <button type="button" key={`${reference.kind}-${reference.id}`} className={`reference-card is-${reference.kind}`} onClick={() => followReference(reference)}>
                      <span className="reference-type">{reference.kind}</span>
                      <strong>{reference.title}</strong>
                      <small>{reference.note}</small>
                      <span className="reference-arrow" aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
          {pending && (
            <article className="chat-message is-assistant is-pending">
              <span className="message-role">Ask CHI</span>
              <div className="typing-dots" aria-label="Ask CHI is thinking"><i /><i /><i /></div>
            </article>
          )}
          <div ref={endRef} />
        </div>

        {messages.length === 1 && (
          <div className="chat-suggestions" aria-label="Suggested questions">
            {suggestions.map((suggestion, index) => (
              <button type="button" key={suggestion} onClick={() => void ask(suggestion)}>
                <span>{String(index + 1).padStart(2, '0')}</span>{suggestion}
              </button>
            ))}
          </div>
        )}

        <form className="chat-composer" onSubmit={submit}>
          <label htmlFor="ask-chi-input">Ask about this CHI website</label>
          <div>
            <textarea id="ask-chi-input" rows={2} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Try: What should I attend after lunch?" disabled={pending} />
            <button type="submit" disabled={!input.trim() || pending} aria-label="Send question">↑</button>
          </div>
          <small>Answers are grounded in this prototype’s fictional site data. AI can make mistakes.</small>
        </form>
      </aside>
    </>
  )
}

