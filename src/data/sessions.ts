import type { ConferenceContent, ConferenceDay, Session } from '../types'

export const conferenceDays: ConferenceDay[] = [
  { id: '2027-05-10', dayName: 'Monday', shortDate: 'May 10', longDate: 'Monday, May 10, 2027' },
  { id: '2027-05-11', dayName: 'Tuesday', shortDate: 'May 11', longDate: 'Tuesday, May 11, 2027' },
  { id: '2027-05-12', dayName: 'Wednesday', shortDate: 'May 12', longDate: 'Wednesday, May 12, 2027' },
]

type ContentSeed = {
  title: string
  authors: string[]
  finding: string
  keywords: string[]
}

function makeContents(prefix: string, seeds: ContentSeed[]): ConferenceContent[] {
  return seeds.map((seed, index) => ({
    id: `${prefix}-paper-${index + 1}`,
    title: seed.title,
    authors: seed.authors,
    keywords: seed.keywords,
    abstract: `${seed.finding} We report findings from a mixed-method study and translate them into practical design considerations. The results show how context, expectations, and interface choices shape people’s experiences, while identifying open questions for future HCI research.`,
  }))
}

/**
 * Fictional prototype data inspired by themes common to HCI conferences.
 * Names, titles, findings, rooms, and schedules are invented for this prototype.
 */
export const sessions: Session[] = [
  {
    id: 'ai-shared-control',
    forYouNotes: ['Assumes some background in human-AI interaction'],
    title: 'Working Together: AI and Shared Control',
    date: '2027-05-10', startTime: '9:00 AM', endTime: '10:20 AM', room: 'Harbor 1', category: 'Paper Session',
    description: 'How people collaborate with intelligent systems while negotiating trust, agency, and shared decision-making.',
    keywords: ['Human-AI Interaction', 'Trust', 'Decision Making', 'Agency'],
    contents: makeContents('ai-shared-control', [
      { title: 'When Suggestions Become Decisions: Calibrating Control in AI-Assisted Work', authors: ['Mina Patel', 'Jon Bell', 'Xinyi Gao'], finding: 'We examine when workplace suggestions from generative systems begin to feel like decisions made on a person’s behalf.', keywords: ['human-ai interaction', 'agency', 'work'] },
      { title: 'Trust Is a Moving Target: Longitudinal Use of Everyday AI', authors: ['Leah Morgan', 'Arun Das'], finding: 'A six-week diary study traces how trust rises, falls, and stabilizes through repeated encounters with imperfect AI.', keywords: ['trust', 'artificial intelligence', 'longitudinal study'] },
      { title: 'Explaining the Fork in the Road: Interfaces for AI Decision Alternatives', authors: ['Sora Kim', 'Mateo Ruiz', 'Helen Cho'], finding: 'We prototype contrastive explanations that reveal plausible alternatives before users accept consequential recommendations.', keywords: ['explainability', 'decision making', 'interfaces'] },
      { title: 'Keeping a Hand on the Wheel in Generative Design', authors: ['Nadia Okafor', 'Iris van Leeuwen'], finding: 'We identify interaction patterns that help designers preserve authorship during rapid AI-supported exploration.', keywords: ['design tools', 'generative AI', 'agency'] },
    ]),
  },
  {
    id: 'access-beyond-compliance',
    forYouNotes: ['A gentle entry point to accessibility practice'],
    title: 'Accessibility Beyond Compliance',
    date: '2027-05-10', startTime: '9:00 AM', endTime: '10:20 AM', room: 'Harbor 3', category: 'Paper Session',
    description: 'Disability-led approaches that move accessibility from a checklist toward adaptable, dignified experiences.',
    keywords: ['Accessibility', 'Inclusive Design', 'Disability', 'Adaptation'],
    contents: makeContents('access-beyond-compliance', [
      { title: 'The Work After the Audit: How Teams Sustain Accessible Products', authors: ['Priya Nair', 'Emmett Ross'], finding: 'Interviews with product teams reveal the organizational labor required to maintain accessibility after a formal audit ends.', keywords: ['accessibility', 'design practice', 'organizations'] },
      { title: 'Personal, Not Prescribed: Low-Vision Readers Configure the Web', authors: ['Dalia Hassan', 'Tomas Eriksen'], finding: 'We study the highly personal strategies low-vision readers use to combine magnification, spacing, color, and browser tools.', keywords: ['low vision', 'assistive technology', 'web'] },
      { title: 'Captions With Context: Representing Tone for Deaf Viewers', authors: ['Yuna Park', 'Camille Brooks', 'Samir Khan'], finding: 'Co-design workshops with Deaf participants surface new ways to communicate emotion and speaker intent without visual clutter.', keywords: ['deaf', 'captions', 'co-design'] },
      { title: 'Designing for Access Friction, Not an Ideal User Journey', authors: ['Noah Williams', 'Mei Tan'], finding: 'We introduce access friction as a lens for documenting the repeated breakdowns disabled people encounter across services.', keywords: ['inclusive design', 'service design', 'disability'] },
      { title: 'Nothing About Us in the Backlog Without Us', authors: ['Fatima El-Sayed', 'Greta Liu'], finding: 'A participatory field study examines how disability advocates influence prioritization inside agile software teams.', keywords: ['accessibility', 'participatory design', 'software teams'] },
    ]),
  },
  {
    id: 'tangible-futures',
    forYouNotes: ['Hands-on demos, no fabrication experience needed'],
    title: 'Tangible Futures: Materials That Respond',
    date: '2027-05-10', startTime: '10:50 AM', endTime: '12:10 PM', room: 'Studio B', category: 'Demo + Papers',
    description: 'New materials and fabrication practices for expressive, responsive, and sustainable physical interactions.',
    keywords: ['Tangible Interaction', 'Fabrication', 'Haptics', 'Sustainability'],
    contents: makeContents('tangible-futures', [
      { title: 'Fold, Press, Remember: Reconfigurable Paper Interfaces', authors: ['Aiko Mori', 'Ben Kline'], finding: 'We present a paper composite that records folds and turns them into programmable input states.', keywords: ['tangible interaction', 'paper', 'fabrication'] },
      { title: 'Soft Signals: Compostable Pneumatic Feedback', authors: ['Lina Costa', 'Priya Nair', 'Mina Patel'], finding: 'A toolkit of compostable pneumatic modules supports temporary haptic prototypes with lower material impact.', keywords: ['haptics', 'sustainable fabrication', 'soft robotics'] },
      { title: 'Clay in the Loop: Sculpting Dynamic Controls by Hand', authors: ['Omar Reyes', 'Jules Martin'], finding: 'We explore how conductive clay lets makers shape and revise physical controls without switching tools.', keywords: ['physical computing', 'prototyping', 'tangible'] },
    ]),
  },
  {
    id: 'community-moderation',
    forYouNotes: ["Case-based; useful if you run or study online communities"],
    title: 'Care and Conflict in Online Communities',
    date: '2027-05-10', startTime: '1:30 PM', endTime: '2:50 PM', room: 'Civic Hall', category: 'Paper Session',
    description: 'The hidden work of moderation, community repair, and collective governance across online spaces.',
    keywords: ['Social Computing', 'Moderation', 'Online Communities', 'Care'],
    contents: makeContents('community-moderation', [
      { title: 'Closing the Thread Without Closing the Door', authors: ['Rosa Grant', 'Nikhil Verma'], finding: 'We analyze how volunteer moderators end harmful conversations while preserving routes back into community participation.', keywords: ['moderation', 'online communities', 'repair'] },
      { title: 'The Emotional Ledger of Volunteer Moderation', authors: ['Anika Cole', 'Jae Lim'], finding: 'Diary studies show how moderators track emotional costs and redistribute difficult work across informal support networks.', keywords: ['social computing', 'emotional labor', 'moderators'] },
      { title: 'Rules We Can Revise: Participatory Governance at Scale', authors: ['Theo James', 'Marisol Vega', 'Qian Wu'], finding: 'We test lightweight mechanisms that let large communities propose, debate, and revisit their own rules.', keywords: ['governance', 'participation', 'online communities'] },
      { title: 'After the Pile-On: Designing for Collective Recovery', authors: ['Sofia Adeyemi', 'Eric Lau'], finding: 'Interviews following high-volume harassment reveal opportunities for platforms to support community-level recovery.', keywords: ['harassment', 'care', 'platform design'] },
    ]),
  },
  {
    id: 'wellbeing-boundaries',
    forYouNotes: ["Approachable for newcomers to health and wellbeing research"],
    title: 'Boundaries, Rest, and Digital Wellbeing',
    date: '2027-05-10', startTime: '3:20 PM', endTime: '4:40 PM', room: 'Harbor 2', category: 'Paper Session',
    description: 'Designs that help people manage attention, work boundaries, rest, and the uneven demands of being connected.',
    keywords: ['Health & Wellbeing', 'Attention', 'Work', 'Rest'],
    contents: makeContents('wellbeing-boundaries', [
      { title: 'Quiet Hours Are Social: Negotiating Disconnection at Work', authors: ['Maya Singh', 'Lucas Meyer'], finding: 'We show that successful disconnection depends less on individual settings than on shared team expectations.', keywords: ['wellbeing', 'work', 'boundaries'] },
      { title: 'A Phone That Lets the Moment End', authors: ['Bea Santos', 'Colin Reed'], finding: 'A field deployment tests gentle stopping cues that create natural endpoints in mobile browsing.', keywords: ['attention', 'mobile', 'digital wellbeing'] },
      { title: 'Rest Is Not a Streak: Rethinking Recovery Tracking', authors: ['Hana Lee', 'Mariam Ali'], finding: 'People recovering from burnout describe how progress mechanics can turn rest into another obligation.', keywords: ['health', 'burnout', 'self-tracking'] },
      { title: 'Family Availability Across Time Zones', authors: ['Diego Flores', 'Neha Rao', 'Leah Morgan'], finding: 'We examine how transnational families coordinate availability without making care feel like constant surveillance.', keywords: ['families', 'care', 'communication'] },
    ]),
  },
  {
    id: 'creative-tools',
    forYouNotes: ['Beginner-friendly look at design tooling'],
    title: 'Tools for Creative Momentum',
    date: '2027-05-11', startTime: '9:00 AM', endTime: '10:20 AM', room: 'Studio A', category: 'Paper Session',
    description: 'Prototyping and design tools that support iteration without flattening uncertainty or creative voice.',
    keywords: ['Design Tools', 'Creativity', 'Prototyping', 'Iteration'],
    contents: makeContents('creative-tools', [
      { title: 'Messy by Design: Preserving Ambiguity in Early Prototypes', authors: ['Isla Bennett', 'Chen Wei'], finding: 'We study how tools can keep early concepts deliberately unresolved instead of nudging designers toward polish.', keywords: ['design tools', 'prototyping', 'ambiguity'] },
      { title: 'Version Histories for Ideas, Not Just Files', authors: ['Malik Johnson', 'Ema Novak'], finding: 'A new history view groups revisions by design intention and helps teams recover abandoned directions.', keywords: ['design practice', 'collaboration', 'creativity'] },
      { title: 'Sketching With Constraints You Can Feel', authors: ['Nora Ibrahim', 'Kenji Sato'], finding: 'Haptic constraints make layout rules perceptible during freehand interface sketching.', keywords: ['haptics', 'design tools', 'sketching'] },
      { title: 'From Critique to Change: Linking Feedback to Iterations', authors: ['Ava Brown', 'Rohan Shah'], finding: 'We connect critique notes with later design decisions to make collaborative rationale visible.', keywords: ['feedback', 'prototyping', 'collaboration'] },
    ]),
  },
  {
    id: 'robots-in-public',
    forYouNotes: ["Includes videos of robots in the field, easy to follow"],
    title: 'Robots Among Us: Encounters in Public',
    date: '2027-05-11', startTime: '9:00 AM', endTime: '10:20 AM', room: 'Harbor 1', category: 'Paper Session',
    description: 'How people interpret, negotiate, and sometimes resist robots operating in shared public settings.',
    keywords: ['Human-Robot Interaction', 'Public Space', 'Embodied Agents', 'Norms'],
    contents: makeContents('robots-in-public', [
      { title: 'Who Goes First? Sidewalk Negotiation With Delivery Robots', authors: ['Jin Park', 'Olivia Hart'], finding: 'Video analysis reveals the subtle gestures pedestrians and delivery robots use to negotiate right of way.', keywords: ['human-robot interaction', 'public space', 'delivery robots'] },
      { title: 'Please Do Not Pet the Museum Guide', authors: ['Eli Turner', 'Sara Nordin'], finding: 'A museum deployment examines how playful robot behavior complicates boundaries around touch and authority.', keywords: ['robot', 'museum', 'social norms'] },
      { title: 'The Robot Saw Me Waiting: Perceived Accountability in Queues', authors: ['Amina Yusuf', 'Pavel Novak'], finding: 'We test how acknowledgment cues affect fairness when service robots manage public queues.', keywords: ['robotics', 'fairness', 'embodied agent'] },
      { title: 'Refusing the Helpful Machine', authors: ['Georgia Price', 'Min Seo'], finding: 'Interviews reveal why people decline robotic assistance and how respectful refusal can be designed.', keywords: ['human-robot interaction', 'agency', 'assistance'] },
    ]),
  },
  {
    id: 'learning-together',
    forYouNotes: ["Practical classroom examples, no technical background needed"],
    title: 'Learning Together, Differently',
    date: '2027-05-11', startTime: '10:50 AM', endTime: '12:10 PM', room: 'Learning Lab', category: 'Paper Session',
    description: 'Collaborative learning technologies shaped around diverse classrooms, literacies, and ways of knowing.',
    keywords: ['Learning Technologies', 'Classroom', 'Collaboration', 'Literacy'],
    contents: makeContents('learning-together', [
      { title: 'One Tablet, Four Voices: Shared Control in Group Learning', authors: ['Alma Reyes', 'Peter Holm'], finding: 'Classroom observations show how shared-device turn taking affects whose ideas become visible.', keywords: ['learning', 'classroom', 'collaboration'] },
      { title: 'Reading Between Languages With Family Annotations', authors: ['Linh Tran', 'Carmen Diaz'], finding: 'A bilingual annotation tool helps families connect school reading with knowledge held at home.', keywords: ['literacy', 'families', 'education'] },
      { title: 'Showing Your Work to an Automated Tutor', authors: ['Tariq Bashir', 'Melissa Wong'], finding: 'We compare interfaces that let students communicate partial reasoning rather than only final answers.', keywords: ['teaching', 'artificial intelligence', 'learning'] },
      { title: 'The Classroom Is Not a Leaderboard', authors: ['Josephine Clark', 'Ahmed Said'], finding: 'Students and teachers redesign progress displays to support motivation without public ranking.', keywords: ['education', 'motivation', 'classroom'] },
      { title: 'Making Space for Silence in Remote Seminars', authors: ['Elsa Romero', 'David Kim'], finding: 'We explore interface rhythms that support reflection and quieter forms of participation online.', keywords: ['learning technologies', 'remote learning', 'participation'] },
    ]),
  },
  {
    id: 'healthcare-handoffs',
    forYouNotes: ["Assumes familiarity with clinical workflows"],
    title: 'Care in the Gaps: Clinical Handoffs',
    date: '2027-05-11', startTime: '1:30 PM', endTime: '2:30 PM', room: 'Harbor 4', category: 'Case Studies',
    description: 'Technologies for the fragile moments when care, context, and responsibility move between people.',
    keywords: ['Health & Wellbeing', 'Clinical Work', 'Care', 'Coordination'],
    contents: makeContents('healthcare-handoffs', [
      { title: 'What the Form Could Not Carry Between Shifts', authors: ['Ren Ito', 'Molly Hughes'], finding: 'Hospital ethnography identifies contextual knowledge that standard handoff forms repeatedly leave behind.', keywords: ['clinical', 'handoffs', 'coordination'] },
      { title: 'A Place for Uncertainty in Patient Portals', authors: ['Zara Malik', 'Henry Cole'], finding: 'We prototype portal language that communicates diagnostic uncertainty without eroding trust.', keywords: ['health', 'patient portal', 'uncertainty'] },
      { title: 'Caregivers as Information Infrastructure', authors: ['Anne Le', 'Kwame Mensah', 'Leah Morgan'], finding: 'Family caregivers describe the invisible work of reconciling conflicting instructions across providers.', keywords: ['care', 'healthcare', 'families'] },
    ]),
  },
  {
    id: 'platform-labor',
    forYouNotes: ["Sociological framing, some theory background helps"],
    title: 'Platform Labor and Everyday Resistance',
    date: '2027-05-11', startTime: '3:00 PM', endTime: '4:20 PM', room: 'Civic Hall', category: 'Paper Session',
    description: 'Worker strategies for navigating algorithmic management, evaluation, and shifting platform rules.',
    keywords: ['Social Computing', 'Labor', 'Algorithms', 'Worker Agency'],
    contents: makeContents('platform-labor', [
      { title: 'Routes the App Does Not Know', authors: ['Luis Ortega', 'Sophie Chen'], finding: 'Delivery workers share local knowledge and collectively route around misleading platform guidance.', keywords: ['platform labor', 'algorithms', 'worker agency'] },
      { title: 'Five Stars, No Explanation', authors: ['Mira Evans', 'Dante Okoro'], finding: 'Service workers describe how opaque ratings affect income, identity, and relations with customers.', keywords: ['ratings', 'labor', 'platforms'] },
      { title: 'Logging Off Together', authors: ['Ana Pereira', 'Mina Patel'], finding: 'We document how workers coordinate temporary platform exits as a low-visibility form of collective action.', keywords: ['social computing', 'collective action', 'workers'] },
      { title: 'The Human Queue Behind Instant Translation', authors: ['Yara Haddad', 'Priya Nair'], finding: 'A study of language workers reveals the human repair labor behind apparently automated services.', keywords: ['artificial intelligence', 'invisible labor', 'language'] },
    ]),
  },
  {
    id: 'privacy-practice',
    forYouNotes: ['Accessible overview for non-specialists'],
    title: 'Privacy as a Shared Practice',
    date: '2027-05-12', startTime: '9:00 AM', endTime: '10:20 AM', room: 'Harbor 2', category: 'Paper Session',
    description: 'Privacy choices as collective, situated practices shaped by households, communities, and institutions.',
    keywords: ['Privacy', 'Households', 'Community', 'Data Practices'],
    contents: makeContents('privacy-practice', [
      { title: 'The Family Password Is a Relationship', authors: ['Ruth Allen', 'Vikram Joshi'], finding: 'Household credential sharing reveals how security practices are entangled with trust and care.', keywords: ['privacy', 'families', 'security'] },
      { title: 'Consent After the Community Meeting', authors: ['Nia Carter', 'Oskar Lind'], finding: 'Community data projects struggle when consent is treated as a one-time individual choice.', keywords: ['community', 'data practices', 'consent'] },
      { title: 'A Camera Pointed at the Whole Hallway', authors: ['Ines Duarte', 'Caleb Green'], finding: 'Apartment residents negotiate competing expectations around shared doorbell camera footage.', keywords: ['privacy', 'surveillance', 'households'] },
      { title: 'Deleting Data Together', authors: ['Sana Rahman', 'Tom Becker'], finding: 'We explore collective deletion tools for groups whose histories are stored across multiple accounts.', keywords: ['data practices', 'groups', 'deletion'] },
    ]),
  },
  {
    id: 'voice-and-sound',
    forYouNotes: ["Hands-on listening demos, good first session of the day"],
    title: 'Voice, Sound, and Sonic Interaction',
    date: '2027-05-12', startTime: '9:00 AM', endTime: '10:20 AM', room: 'Sound Room', category: 'Demo + Papers',
    description: 'Sonic interfaces that make interaction legible through voice, place, rhythm, and embodied listening.',
    keywords: ['Sound', 'Voice Interfaces', 'Embodied Interaction', 'Accessibility'],
    contents: makeContents('voice-and-sound', [
      { title: 'Listening for the Room in Voice Commands', authors: ['Hugo Martin', 'Sae Ito'], finding: 'We show how voice interfaces can account for shared spaces rather than treating speech as private input.', keywords: ['voice interfaces', 'social context', 'sound'] },
      { title: 'A Rhythm for Screen-Free Navigation', authors: ['Imani Foster', 'Pia Jensen'], finding: 'Blind travelers co-design rhythmic cues for understanding routes without continuous spoken directions.', keywords: ['blind', 'accessibility', 'audio navigation'] },
      { title: 'Whose Accent Gets to Be a Shortcut?', authors: ['Neel Gupta', 'Farah Abbas'], finding: 'Speakers examine how command customization shifts the burden of adapting to speech recognition.', keywords: ['voice', 'inclusive design', 'speech recognition'] },
      { title: 'The Sound of a System Waiting', authors: ['Julian Cross', 'Mai Pham'], finding: 'We develop subtle sonic cues that communicate latency and uncertainty without demanding visual attention.', keywords: ['sound', 'feedback', 'interfaces'] },
    ]),
  },
  {
    id: 'climate-adaptation',
    forYouNotes: ["Broad overview, a good entry to the topic"],
    title: 'Designing With Climate Uncertainty',
    date: '2027-05-12', startTime: '10:50 AM', endTime: '12:10 PM', room: 'Civic Hall', category: 'Paper Session',
    description: 'Community-led tools for interpreting uncertainty and coordinating local responses to environmental change.',
    keywords: ['Climate', 'Community', 'Uncertainty', 'Civic Technology'],
    contents: makeContents('climate-adaptation', [
      { title: 'Flood Maps That Remember the Last Storm', authors: ['Grace Kim', 'Mohamed Saleh'], finding: 'Residents annotate official flood maps with lived histories that reveal gaps in predictive models.', keywords: ['climate', 'maps', 'community'] },
      { title: 'Forecasts as a Neighborhood Conversation', authors: ['Teresa Silva', 'Benji Ward'], finding: 'A civic display supports local interpretation of heat forecasts and mutual-aid planning.', keywords: ['civic technology', 'climate', 'coordination'] },
      { title: 'Repairing Sensors, Repairing Trust', authors: ['Noura Elmi', 'Jack Peters'], finding: 'Community air-monitoring groups show how maintaining devices and maintaining trust become the same work.', keywords: ['sensors', 'trust', 'environment'] },
      { title: 'Designing for Plans That Will Change', authors: ['Callum Wright', 'Erin Zhao'], finding: 'We propose adaptable planning tools that keep assumptions visible as environmental conditions shift.', keywords: ['uncertainty', 'planning', 'design tools'] },
    ]),
  },
  {
    id: 'playful-bodies',
    forYouNotes: ["Light and participatory, no preparation needed"],
    title: 'Playful Bodies and Movement',
    date: '2027-05-12', startTime: '1:30 PM', endTime: '2:50 PM', room: 'Studio B', category: 'Interactive Session',
    description: 'Embodied and playful interactions that use movement to support expression, learning, and connection.',
    keywords: ['Embodied Interaction', 'Play', 'Movement', 'Tangible Interaction'],
    contents: makeContents('playful-bodies', [
      { title: 'Dancing With a Delay', authors: ['Lola Mensah', 'Finn Berger'], finding: 'Remote dancers turn network latency into choreographic material rather than treating it only as failure.', keywords: ['movement', 'performance', 'embodied interaction'] },
      { title: 'A Playground You Can Reprogram by Running', authors: ['Chloe Tan', 'Isaac Moore'], finding: 'Children reshape interactive playground rules through collective movement patterns.', keywords: ['play', 'learning', 'physical computing'] },
      { title: 'Wearable Prompts for Improvised Connection', authors: ['Marta Kowalski', 'Rin Okada'], finding: 'Soft wearable cues invite low-pressure movement exchanges between strangers at public events.', keywords: ['wearables', 'tangible interaction', 'social connection'] },
      { title: 'Feeling the Shape of a Shared Gesture', authors: ['Abel King', 'Zoe Laurent'], finding: 'A haptic system lets remote partners feel the direction and force of each other’s gestures.', keywords: ['haptics', 'embodied', 'collaboration'] },
    ]),
  },
  {
    id: 'methods-and-power',
    forYouNotes: ['Dense methods discussion, best with study experience'],
    title: 'Methods, Participation, and Power',
    date: '2027-05-12', startTime: '3:20 PM', endTime: '4:40 PM', room: 'Harbor 1', category: 'Panel + Papers',
    description: 'Critical reflections on participation, research relationships, and who benefits from design methods.',
    keywords: ['Participatory Design', 'Research Ethics', 'Power', 'Methods'],
    contents: makeContents('methods-and-power', [
      { title: 'Who Owns the Workshop Wall?', authors: ['Simone Davis', 'Haruto Abe'], finding: 'We trace what happens to ideas, artifacts, and authority after participatory workshops end.', keywords: ['participatory design', 'research ethics', 'ownership'] },
      { title: 'Compensation Is Part of the Method', authors: ['Layla Gordon', 'Nate Chu'], finding: 'Community research partners describe how payment structures communicate whose time and expertise count.', keywords: ['methods', 'power', 'community'] },
      { title: 'Returning With Results That People Can Use', authors: ['Paloma Cruz', 'Ethan Bell'], finding: 'We examine practical formats for returning findings to participants beyond academic publication.', keywords: ['research ethics', 'participation', 'impact'] },
      { title: 'Saying No to the Research Question', authors: ['Mariam Diallo', 'Sven Larsen'], finding: 'Cases of participant refusal show how a project can change when dissent is treated as knowledge.', keywords: ['power', 'methods', 'consent'] },
      { title: 'Designing Accountability Into Fieldwork', authors: ['Holly Nguyen', 'Adrian Moss'], finding: 'A lightweight protocol helps teams document commitments and revisit them throughout long field studies.', keywords: ['design practice', 'accountability', 'fieldwork'] },
    ]),
  },
]

export const sessionsByDate = (date: string) => sessions.filter((session) => session.date === date)

export const getSessionById = (id: string) => sessions.find((session) => session.id === id)
