import type { AppData } from '../types';

export const initialData: AppData = {
  principles: [
    { id: 'p1', content: 'Take him in the direction he wants to go', category: 'universal' },
    { id: 'p2', content: 'Get the inside position', category: 'universal' },
    { id: 'p3', content: 'Keep your arms close to your body', category: 'universal' },
    { id: 'p4', content: 'Bottom rule: Frames → hip escape → reguard or stand', category: 'bottom' },
    { id: 'p5', content: 'Top rule: Base → pressure → isolate → advance → submit', category: 'top' },
    { id: 'p6', content: 'Always think in terms of inside positioning. Are your limbs inside his limbs or are his limbs inside your limbs?', category: 'universal' },
    { id: 'p7', content: 'Pins are more effective when your spine is perpendicular with your opponent\'s spine', category: 'top' },
    { id: 'p8', content: 'A pin is a set of wedges reinforced by body weight', category: 'top' },
    { id: 'p9', content: 'Have faith that you\'ll need to work incrementally to bring your limbs one by one inside of your opponent\'s limbs', category: 'universal' },
    { id: 'p10', content: 'As the bottom player, your number one priority is to create space', category: 'bottom' },
    { id: 'p11', content: 'Hand-fight first to protect your neck', category: 'universal' },
    { id: 'p12', content: 'Apply pressure from top positions', category: 'top' },
  ],
  positions: [
    {
      id: 'closed-guard',
      name: 'Closed Guard',
      bottom: {
        doFirst: [
          'Break their posture: collar & sleeve (gi) or head control & triceps (no-gi)',
          'Angle your hips (don\'t stay flat); feet active and knees pinched',
          'Control an arm or the head before opening your guard',
          'Don\'t go to your partner. Use your knees to bring him to you',
          'Use angles by shrimping',
        ],
        techniques: [
          {
            id: 'cg-b1',
            name: 'Hip-Bump Sweep (Sit-Up Sweep)',
            description: 'Sit up explosively when they posture, sweep them over your shoulder',
            notes: ['You can use the Kimura from bottom of closed guard to get them to posture up, then transition to a hip bump sweep'],
          },
          {
            id: 'cg-b2',
            name: 'Scissor Sweep',
            description: 'Control sleeve and collar, put shin across their stomach, kick out their knee while pulling',
            notes: ['From closed guard, fake the scissor sweep, then throw the leg on the chest over the shoulder'],
          },
          {
            id: 'cg-b3',
            name: 'Pendulum/Flower Sweep',
            description: 'Control sleeve, swing leg high and pendulum them over',
            notes: [],
          },
          {
            id: 'cg-b4',
            name: 'Armbar',
            description: 'Control wrist, pivot hips, leg over head, squeeze knees and extend',
            notes: [],
          },
          {
            id: 'cg-b5',
            name: 'Triangle',
            description: 'Control posture, one arm in one arm out, shoot legs up and lock triangle',
            notes: [
              'Requires one arm out and one arm in',
              'Primary defenses are posturing and stacking',
              'Grab your shin to control their posture',
              'Use foot on hip to stop stacking',
            ],
          },
          {
            id: 'cg-b6',
            name: 'Cross-Collar Choke (Gi)',
            description: 'Deep collar grips, pull elbows together',
            notes: [],
          },
          {
            id: 'cg-b7',
            name: 'Arm-Drag to Back',
            description: 'Drag their arm across, come up and take the back',
            notes: [],
          },
          {
            id: 'cg-b8',
            name: 'Kimura',
            description: 'Figure-four grip on their wrist, rotate shoulder',
            notes: [
              'Keep their elbow close to your face, and their elbow angle tight, less than 90 degrees, and only move their hand',
              'You can use the Kimura from bottom of closed guard to get them to posture up, then transition to a hip bump sweep',
            ],
          },
        ],
        transitions: ['Hip-bump → come on top to mount', 'Arm-drag → back control'],
        notes: [],
      },
      top: {
        doFirst: [
          'Good posture (head up, back straight), elbows inside the thighs, hands on torso/hips—not on the mat',
          'Stand or knee-up to open; keep knees and hips square to deny angles',
          'Just stand up',
          'Put your hands at his biceps or armpits',
        ],
        techniques: [
          {
            id: 'cg-t1',
            name: 'Stand-to-Open',
            description: 'Stand up with good base to break the guard open',
            notes: ['If he sweeps you when you stand up, pinch your legs together'],
          },
          {
            id: 'cg-t2',
            name: 'Knee-in-Tailbone Pry',
            description: 'Drive knee into tailbone to break guard open',
            notes: [],
          },
        ],
        transitions: ['Guard opens → knee-cut pass', 'Guard opens → double-under pass', 'Guard opens → toreando'],
        notes: [],
      },
    },
    {
      id: 'open-guard',
      name: 'Open/Seated Guard',
      bottom: {
        doFirst: [
          'Establish 2 connections: e.g., both feet on hips/shins + 2 sleeves (gi) or ankles/wrists (no-gi)',
          'Manage distance: scoot in for hooks (butterfly) or extend for foot-on-hip/shin-on-shin',
        ],
        techniques: [
          {
            id: 'og-b1',
            name: 'Tripod Sweep',
            description: 'One hand grabs ankle, foot on hip, other foot hooks behind their other ankle',
            notes: [
              'Tripod sweep when they try to get up from closed guard',
              'If you can\'t hook the back leg, options include de la riva, sickle sweep, ashi',
            ],
          },
          {
            id: 'og-b2',
            name: 'Sickle Sweep',
            description: 'Hook behind both ankles and sweep them backward',
            notes: ['Works great as a combo with tripod sweep'],
          },
          {
            id: 'og-b3',
            name: 'Butterfly Sweep',
            description: 'Underhook, hook under thigh with butterfly hook, elevate and roll',
            notes: [],
          },
          {
            id: 'og-b4',
            name: 'Technical Stand-Up',
            description: 'Post hand, kick leg through, stand to neutral',
            notes: [],
          },
          {
            id: 'og-b5',
            name: 'Arm-Drag to Back',
            description: 'Drag their arm across, come up and take the back',
            notes: [],
          },
          {
            id: 'og-b6',
            name: 'Ashi Garami Entry',
            description: 'Enter leg entanglement from open guard',
            notes: [
              'Ashi standing, but they peel your leg, so you switch to x guard, then reverse tripod sweep',
              'Ashi standing, and they peel your foot, so instead of knee you bring that foot to the outside, then figure four with your other leg to sweep them',
              'Ashi sitting, but they peel your foot and want to scoot their butt out, so you move it to the outside, and hook your bottom leg over',
            ],
          },
          {
            id: 'og-b7',
            name: 'De La Riva',
            description: 'Hook their leg with your outside leg, control sleeve',
            notes: ['Option when you can\'t hook back leg for tripod sweep'],
          },
        ],
        transitions: ['Tripod/Sickle → come on top', 'Technical stand-up → takedown', 'Arm-drag → back control'],
        notes: [],
      },
      top: {
        doFirst: [
          'Hands on shins/hips—not collars—while standing; step around their feet, don\'t swat',
          'Win inside ties (pummel past their hooks/knees)',
        ],
        techniques: [
          {
            id: 'og-t1',
            name: 'Toreando Pass',
            description: 'Grip pants/cuffs, push legs to one side and pass around',
            notes: [],
          },
          {
            id: 'og-t2',
            name: 'Knee-Cut Pass',
            description: 'Pin their shin, slice knee across to the other side',
            notes: [],
          },
          {
            id: 'og-t3',
            name: 'Body-Lock Pass',
            description: 'Connect chest-to-hips with body lock, walk around',
            notes: [],
          },
        ],
        transitions: ['Pass → side control', 'Pass → knee-on-belly'],
        notes: ['If you\'re on your knees and someone is in butterfly, and they bring you back, apply pressure'],
      },
    },
    {
      id: 'half-guard',
      name: 'Half Guard',
      bottom: {
        doFirst: [
          'Frame with near-side forearm across their collarbone/neck',
          'Hide the underhook they want, take your own underhook',
          'Get on your side facing them; knee-shield if smashed',
        ],
        techniques: [
          {
            id: 'hg-b1',
            name: 'Underhook Escape ("Walk to Back")',
            description: 'Get underhook, come up to knees, take the back',
            notes: [],
          },
          {
            id: 'hg-b2',
            name: 'Old-School Sweep',
            description: 'Lock their trapped foot, come up on top',
            notes: [],
          },
          {
            id: 'hg-b3',
            name: 'Waiter Sweep (from Deep Half)',
            description: 'Get deep under them, lift leg like a waiter, sweep',
            notes: [],
          },
          {
            id: 'hg-b4',
            name: 'Kimura (from Knee Shield)',
            description: 'Attack kimura when they post hand to pass',
            notes: [],
          },
          {
            id: 'hg-b5',
            name: 'Guillotine',
            description: 'If they drop their head, wrap the neck',
            notes: [],
          },
        ],
        transitions: ['Underhook → back take', 'Deep-half → come up on top', 'Recover closed guard via knee-elbow escape'],
        notes: [],
      },
      top: {
        doFirst: [
          'Flatten them: crossface + far-side underhook; trap their hips with your free knee',
          'Free your trapped leg by back-stepping or knee-sliding with hip pressure',
        ],
        techniques: [
          {
            id: 'hg-t1',
            name: 'Knee-Cut Pass',
            description: 'Slice knee across while controlling their upper body',
            notes: [],
          },
          {
            id: 'hg-t2',
            name: 'Smash/Shoulder-Pressure Pass',
            description: 'Heavy shoulder pressure, extract leg',
            notes: [],
          },
          {
            id: 'hg-t3',
            name: 'Backstep Pass',
            description: 'Step back and extract leg to reverse half → side control',
            notes: [],
          },
          {
            id: 'hg-t4',
            name: 'Cross-Choke (Gi)',
            description: 'When you win the collar, apply cross-choke',
            notes: [],
          },
          {
            id: 'hg-t5',
            name: 'Knee Shield Counter → Knee-on-Belly',
            description: 'When they get knee shield, bring their knees vertical, donkey kick to free your leg',
            notes: [
              'From the knee cut pass, if they get a knee shield with the other leg, you can reach down and bring their knees vertical and then kick up like a donkey kick to free your leg and then go to knee on belly',
              'If they lock their feet around your legs so you can\'t kick your leg up, push their knee back and slide your knee to the other side so you have one knee on either side. One knee should be up at their shoulder blades. Windshield wiper that foot, but first get gift wrap.',
            ],
          },
        ],
        transitions: ['Pass → mount', 'Pass → side control', 'Pass → back take if they turn'],
        notes: [
          'Gift wrap sequence: Push their elbow to reach around their head and grab their hand. With the hand that was pushing their elbow, grab your own wrist. Straighten the arm grabbing their wrist to control their head. Fall back and go to other side to get foot on hip. You now have back control.',
        ],
      },
    },
    {
      id: 'side-control',
      name: 'Side Control',
      bottom: {
        doFirst: [
          'Frames: near-side forearm at their neck/shoulder line, far-side forearm on their hip',
          'Bridge, insert near knee, then shrimp to recover guard (knee-elbow escape)',
          'Inside leg presses against their hip. If he tries to mount, rotate and insert your knee',
          'Inside arm is an antenna to monitor what they\'re doing. It can be inside (their neck) or outside. Inside is better.',
        ],
        techniques: [
          {
            id: 'sc-b1',
            name: 'Knee-Elbow Escape (Shrimp to Guard)',
            description: 'Bridge to create space, insert knee, shrimp to guard',
            notes: [
              'Inside arm on their neck is what allows you to escape. The discomfort causes them to adjust so that you can insert your knee.',
              'Your outside leg moves out to push against the mat and allow you to insert.',
              'Invert your knee (foot higher than knee) to be able to insert knee. Kip your leg.',
              'After the escape, make sure your arm is available to go inside their cross-facing arm',
              'After the escape, don\'t sit up too quickly. Instead, get an underhook, so that you can float their body back',
              'Keep your knee elbow connection',
            ],
          },
          {
            id: 'sc-b2',
            name: 'Underhook to Dogfight',
            description: 'Get underhook, come up to knees, attack single leg',
            notes: [],
          },
          {
            id: 'sc-b3',
            name: 'Bridge to Roll',
            description: 'When their weight is high and head is posted wrong, bridge to roll',
            notes: [],
          },
        ],
        transitions: ['Escape → half guard → closed guard', 'Underhook → dogfight → single leg'],
        notes: [
          'Get to your side: Your outside arm, not framed on the neck, helps you rotate onto your side by connecting to your opponent',
          'You can rotate out to rotate in',
          'If they\'re pushing your chin outside, you can\'t face inside. But if you can face inside, face inside.',
          'If your chin is pushed outside, take him in that direction',
          'You can turn away to get your outside arm frame',
          'Use your outside arm frame so that you can move your hips away and enter with your knee',
          'When you\'re on your right side, you shrimp with your right hand on your forehead and your left hand on your right shoulder. This is to prevent both of the underhooks.',
          'Wait for them to give you the opportunity to move your hand inside',
          'They\'re in between your hips and your elbow',
        ],
      },
      top: {
        doFirst: [
          'Chest-to-chest, crossface + far underhook; hips low and sprawling the near leg',
          'Kill their frames: windshield-wipe your knees to block their hip',
        ],
        techniques: [
          {
            id: 'sc-t1',
            name: 'Americana (Keylock)',
            description: 'Figure-four grip on near arm, paint brush motion',
            notes: ['Remember: outside elbow by their head'],
          },
          {
            id: 'sc-t2',
            name: 'Kimura',
            description: 'Figure-four grip, rotate shoulder',
            notes: ['Switch your hands from Americana position', 'If they keep going, pull with your underhook, and rotate around their head for armlock'],
          },
          {
            id: 'sc-t3',
            name: 'Straight Armbar',
            description: 'If they extend their arm, attack the armbar',
            notes: [],
          },
          {
            id: 'sc-t4',
            name: 'Far-Side Armbar',
            description: 'Step over head, isolate far arm, finish armbar',
            notes: [],
          },
          {
            id: 'sc-t5',
            name: 'North-South Choke',
            description: 'Transition to north-south, apply choke',
            notes: [],
          },
          {
            id: 'sc-t6',
            name: 'Gift Wrap to Back',
            description: 'Grab their far wrist, feed to your hand behind their head, take back',
            notes: [],
          },
        ],
        transitions: ['Knee-on-belly', 'Mount', 'Back via gift-wrap', 'North-south'],
        notes: [
          'Mousetrap system: Use scarf hold to isolate inside arm before working on outside arm',
          'In side control with both arms over, you can go between: Americana (remember outside elbow by their head), Straight arm bar (if they extend), Kimura (switch your hands if they keep going)',
        ],
      },
    },
    {
      id: 'mount',
      name: 'Mount',
      bottom: {
        doFirst: [
          'Hands protect the collar/neck; elbows glued to ribs to prevent isolations',
          'Pick one escape and commit: Upa (trap-and-roll) when they post a hand or knee-elbow shrimp to half guard',
        ],
        techniques: [
          {
            id: 'm-b1',
            name: 'Upa (Trap-and-Roll)',
            description: 'Trap arm and leg on same side, bridge and roll',
            notes: [],
          },
          {
            id: 'm-b2',
            name: 'Elbow-Knee Escape',
            description: 'Frame on hip, shrimp out, insert knee to half guard',
            notes: [],
          },
        ],
        transitions: ['Upa → closed guard or top half', 'Knee-elbow → half guard → full guard'],
        notes: ['Don\'t give your back unless you\'re ready to fight hands immediately'],
      },
      top: {
        doFirst: [
          'Stabilize with grapevines or low-mount; heavy hips; hands wide',
          'Climb to high mount as they defend; trap an arm with your knee or a gift-wrap',
        ],
        techniques: [
          {
            id: 'm-t1',
            name: 'Americana (Low Mount)',
            description: 'Figure-four grip, paint brush motion',
            notes: ['Note that cross collar choke and Americana defenses can let you transition to arm bar'],
          },
          {
            id: 'm-t2',
            name: 'Cross-Collar Choke (Gi)',
            description: 'Deep collar grips, pull elbows together',
            notes: ['Note that cross collar choke and Americana defenses can let you transition to arm bar'],
          },
          {
            id: 'm-t3',
            name: 'Armbar (from S-Mount)',
            description: 'Isolate arm, transition to S-mount, fall back for armbar',
            notes: [],
          },
          {
            id: 'm-t4',
            name: 'Ezekiel Choke (Gi)',
            description: 'Feed hand through sleeve, choke with forearm',
            notes: [],
          },
          {
            id: 'm-t5',
            name: 'Gift Wrap → Kimura Grip → Back',
            description: 'Push arm down, they grab with other arm, drop chest on elbow, gift wrap, kimura grip with body triangle',
            notes: [],
          },
        ],
        transitions: ['They turn? Take the back', 'If they elbow-knee escape, float to knee-on-belly and remount'],
        notes: ['Knee on belly is more like knee on solar plexus'],
      },
    },
    {
      id: 'back-control',
      name: 'Back Control',
      bottom: {
        doFirst: [
          'Two-on-one the choking arm; chin down but don\'t rely on it',
          'Get your back to the mat: clear a hook, slide to the over-hook side, and turn into guard/half',
        ],
        techniques: [
          {
            id: 'bc-b1',
            name: 'Scoop Hook Escape',
            description: 'Scoop the bottom hook with your foot + hip slide',
            notes: [],
          },
          {
            id: 'bc-b2',
            name: 'Fall to Safe Side',
            description: 'Fall to safe side, peel top hand, get shoulders flat, then turn in',
            notes: [],
          },
        ],
        transitions: ['Escape → guard/half guard', 'Turn into them'],
        notes: [
          'If someone crosses their ankles, bring opposite leg of their top leg over feet, figure four over yours, and bridge',
        ],
      },
      top: {
        doFirst: [
          'Seatbelt (over/under), head close to their head; hooks in or body triangle',
          'Hand fight first: threaten the choke only after controlling their defending hands',
        ],
        techniques: [
          {
            id: 'bc-t1',
            name: 'Rear-Naked Choke (RNC)',
            description: 'Hand behind head, squeeze elbows together',
            notes: [],
          },
          {
            id: 'bc-t2',
            name: 'Short Choke (No-Gi)',
            description: 'Palm-to-palm grip under chin',
            notes: [],
          },
          {
            id: 'bc-t3',
            name: 'Bow-and-Arrow Choke (Gi)',
            description: 'Collar grip, grab pants, extend',
            notes: [],
          },
          {
            id: 'bc-t4',
            name: 'Sliding Lapel Choke (Gi)',
            description: 'Slide lapel across neck',
            notes: [],
          },
        ],
        transitions: ['If they slide off the under-hook side, follow to mount'],
        notes: [
          'Use the body triangle from the back',
          'Don\'t cross your ankles (opponent can attack)',
        ],
      },
    },
    {
      id: 'turtle',
      name: 'Turtle',
      bottom: {
        doFirst: [
          'Elbows and knees tight, chin tucked; hands at your neck line',
          'Move: sit-out to guard, Granby roll when they\'re beside you, or peek-out to a single if you have an underhook',
        ],
        techniques: [
          {
            id: 't-b1',
            name: 'Sit-Through to Guard',
            description: 'Sit through and face them, recover guard',
            notes: [],
          },
          {
            id: 't-b2',
            name: 'Granby Roll',
            description: 'Roll over shoulder to face them',
            notes: [],
          },
          {
            id: 't-b3',
            name: 'Peek-Out to Single Leg',
            description: 'If you have underhook, peek out and attack single',
            notes: [],
          },
        ],
        transitions: ['Sit-through → guard', 'Peek-out → top/front headlock', 'Rolling → face them and prevent back take'],
        notes: [],
      },
      top: {
        doFirst: [
          'Block the near hip with your knee/hand; keep chest heavy and behind their shoulders',
          'Get seatbelt or front headlock without diving over',
        ],
        techniques: [
          {
            id: 't-t1',
            name: 'Back Take (Seatbelt + Hook)',
            description: 'Get seatbelt, insert hook, take the back',
            notes: [],
          },
          {
            id: 't-t2',
            name: 'Spiral Ride to Back',
            description: 'Spiral around to chase hooks',
            notes: [],
          },
          {
            id: 't-t3',
            name: 'Clock Choke (Gi)',
            description: 'Lapel grip, walk around their head',
            notes: [],
          },
          {
            id: 't-t4',
            name: 'Guillotine',
            description: 'If they pop up with head low, wrap the neck',
            notes: [],
          },
        ],
        transitions: ['Spin to side control if they turn in'],
        notes: [],
      },
    },
    {
      id: 'north-south',
      name: 'North-South',
      bottom: {
        doFirst: [
          'Frame on their hip/ribs, not their shoulders; turn to a side facing them',
          'Hip escape and re-insert a knee to guard',
        ],
        techniques: [
          {
            id: 'ns-b1',
            name: 'Walk Shoulders Away',
            description: 'Walk your shoulders away from them',
            notes: [],
          },
          {
            id: 'ns-b2',
            name: 'Pummel Underhook to Turtle',
            description: 'Pummel an underhook, come to turtle, then reguard',
            notes: [],
          },
        ],
        transitions: ['Escape → guard', 'Escape → turtle → guard'],
        notes: [],
      },
      top: {
        doFirst: [
          'Hips low, control an arm; head near their far hip to block their turn',
          'Keep walking around their head to follow their frames',
        ],
        techniques: [
          {
            id: 'ns-t1',
            name: 'Kimura',
            description: 'Figure-four grip from north-south',
            notes: [],
          },
          {
            id: 'ns-t2',
            name: 'North-South Choke',
            description: 'Wrap head and arm, squeeze with shoulder pressure',
            notes: [],
          },
        ],
        transitions: ['Back to side control', 'Step over to mount when they over-frame'],
        notes: [],
      },
    },
    {
      id: 'knee-on-belly',
      name: 'Knee-on-Belly',
      bottom: {
        doFirst: [
          'Frame on their shin and far shoulder/hip; bridge, then turn your knees toward them to lighten the knee',
          'Shrimp to re-guard or go to half guard under the knee',
        ],
        techniques: [
          {
            id: 'kob-b1',
            name: 'Push Knee to Inside Pocket',
            description: 'Push their knee while hip-escaping',
            notes: [],
          },
          {
            id: 'kob-b2',
            name: 'Invert to Half Guard',
            description: 'Invert your hips to capture half guard',
            notes: [],
          },
        ],
        transitions: ['Escape → half guard', 'Escape → guard'],
        notes: [],
      },
      top: {
        doFirst: [
          'Posture tall, toes posted; control near collar/sleeve (gi) or head/arm (no-gi)',
          'Follow their hip movement—don\'t let them turn you',
        ],
        techniques: [
          {
            id: 'kob-t1',
            name: 'Baseball-Bat Choke (Gi)',
            description: 'Cross-grip collars, drop and spin',
            notes: [],
          },
          {
            id: 'kob-t2',
            name: 'Straight Armbar',
            description: 'Attack the near arm',
            notes: [],
          },
        ],
        transitions: ['Slide to mount', 'Switch to far-side side control'],
        notes: ['Knee on belly is more like knee on solar plexus'],
      },
    },
    {
      id: 'standing',
      name: 'Standing/Takedowns',
      bottom: {
        doFirst: [
          'If you pull guard: collar & sleeve → step in → sit to closed guard',
        ],
        techniques: [
          {
            id: 'st-b1',
            name: 'Guard Pull',
            description: 'Controlled sit to closed guard with grips',
            notes: [],
          },
        ],
        transitions: ['Guard pull → closed guard'],
        notes: [],
      },
      top: {
        doFirst: [
          'Stance: hips back, elbows in; get your grips before theirs',
          'Decide early: takedown or pull guard (if allowed)',
        ],
        techniques: [
          {
            id: 'st-t1',
            name: 'Collar Drag (Gi)',
            description: 'Drag them by the collar, come up behind',
            notes: [],
          },
          {
            id: 'st-t2',
            name: 'Double-Leg Takedown',
            description: 'Level change, head tight, drive through',
            notes: [],
          },
          {
            id: 'st-t3',
            name: 'Single-Leg Takedown',
            description: 'Grab one leg, run the pipe',
            notes: [],
          },
          {
            id: 'st-t4',
            name: 'Inside Trip / Osoto Gari',
            description: 'Reap their leg from inside or outside',
            notes: [],
          },
          {
            id: 'st-t5',
            name: 'Snap-Down to Front Headlock',
            description: 'Snap down vs upright posture, spin to turtle/top',
            notes: [],
          },
        ],
        transitions: ['Takedown → side control', 'Takedown → mount', 'Snap-down → front headlock → turtle attack'],
        notes: [],
      },
    },
  ],
};
