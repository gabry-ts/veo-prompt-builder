// Veo 3.1 complete structure - aligned with official documentation
export interface VeoPromptStructure {
  video_length: number; // 4, 6, or 8 seconds
  resolution: '720p' | '1080p'; // 720p or 1080p
  aspect_ratio: '16:9' | '9:16'; // 16:9 or 9:16
  prompt: {
    // Core 5-part formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
    cinematography: {
      camera_movement?: string; // Dolly shot, tracking shot, crane shot, aerial view, slow pan, POV shot
      composition?: string; // Wide shot, close-up, extreme close-up, low angle, two-shot
      lens_and_focus?: string; // Shallow depth of field, wide-angle lens, soft focus, macro lens
    };
    subject: string; // Main character or focal point
    action: string; // What the subject is doing
    context: string; // Environment and background elements
    style_and_ambiance: string; // Overall aesthetic, mood, and lighting

    // Audio features (Veo 3.1)
    audio?: {
      dialogue?: Array<{
        character: string;
        speech: string; // Will be formatted as: character says "speech"
        voice_description?: string; // E.g., "in a weary voice", "cheerfully"
      }>;
      sound_effects?: string[]; // Will be formatted as: SFX: description
      ambient_noise?: string; // Will be formatted as: Ambient noise: description
    };

    // Negative prompt
    negative_prompt?: string;

    // Timestamp prompting for multi-shot sequences
    sequence: Array<{
      timestamp: string; // Format: [00:00-00:02] or "0.0s-2.0s"
      shot_description: string; // Full description including cinematography, subject, action
      emotion?: string; // Emotion: description
      sfx?: string; // SFX: specific sound for this shot
    }>;

    // Advanced creative controls metadata
    creative_controls?: {
      mode?: 'text-to-video' | 'image-to-video' | 'ingredients-to-video' | 'first-last-frame';
      reference_images?: string[]; // Image URLs or descriptions
      notes?: string;
    };

    notes?: string; // General technical notes
  };
}

export interface TemplateDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'cinematic' | 'commercial' | 'abstract' | 'dialogue' | 'nature' | 'tech';
  template: VeoPromptStructure;
}

// Cinematography constants for suggestions
export const CAMERA_MOVEMENTS = [
  'Dolly shot',
  'Tracking shot',
  'Crane shot',
  'Aerial view',
  'Slow pan',
  'POV shot',
  'Handheld',
  'Steadicam',
  'Zoom in',
  'Zoom out',
  '180-degree arc shot',
  'Reverse shot',
  'Static camera',
];

export const COMPOSITIONS = [
  'Wide shot',
  'Medium shot',
  'Close-up',
  'Extreme close-up',
  'Low angle',
  'High angle',
  'Two-shot',
  'Over-the-shoulder',
  'Dutch angle',
  "Bird's eye view",
  "Worm's eye view",
];

export const LENS_AND_FOCUS = [
  'Shallow depth of field',
  'Deep focus',
  'Wide-angle lens',
  'Telephoto lens',
  'Macro lens',
  'Soft focus',
  'Rack focus',
  'Tilt-shift',
  'Lens flare',
];

export const emptyTemplate: VeoPromptStructure = {
  video_length: 8,
  resolution: '1080p',
  aspect_ratio: '16:9',
  prompt: {
    cinematography: {
      camera_movement: '',
      composition: '',
      lens_and_focus: '',
    },
    subject: '',
    action: '',
    context: '',
    style_and_ambiance: '',
    audio: {
      dialogue: [],
      sound_effects: [],
      ambient_noise: '',
    },
    negative_prompt: '',
    sequence: [
      {
        timestamp: '[00:00-00:02]',
        shot_description: '',
        emotion: '',
        sfx: '',
      },
      {
        timestamp: '[00:02-00:05]',
        shot_description: '',
        emotion: '',
        sfx: '',
      },
      {
        timestamp: '[00:05-00:08]',
        shot_description: '',
        emotion: '',
        sfx: '',
      },
    ],
    creative_controls: {
      mode: 'text-to-video',
      reference_images: [],
      notes: '',
    },
    notes: '',
  },
};

export const veoTemplates: TemplateDomain[] = [
  {
    id: 'jungle-explorer',
    name: 'Jungle Explorer',
    description: 'Multi-shot adventure sequence from official Veo 3.1 documentation',
    icon: '🗺️',
    category: 'cinematic',
    template: {
      video_length: 8,
      resolution: '1080p',
      aspect_ratio: '16:9',
      prompt: {
        cinematography: {
          camera_movement: 'Tracking shot, reverse shot, crane shot',
          composition:
            'Medium shot from behind, reverse shot, tracking shot, wide high-angle crane shot',
          lens_and_focus: 'Deep focus for environment',
        },
        subject: 'Young female explorer with leather satchel and messy brown hair in ponytail',
        action:
          'Explorer pushes aside jungle vine, discovers hidden ancient ruins, examines carvings',
        context:
          'Dense jungle environment with moss-covered ancient ruins, dappled sunlight through canopy',
        style_and_ambiance: 'Cinematic adventure, awe-inspiring, natural lighting with god rays',
        audio: {
          dialogue: [],
          sound_effects: [
            'Rustling of dense leaves',
            'Distant exotic bird calls',
            'Stone scraping as she touches carvings',
          ],
          ambient_noise:
            'Rich jungle soundscape with layers of insects, birds, rustling vegetation, distant waterfalls',
        },
        negative_prompt:
          'No modern elements, no safety equipment visible, no unnatural lighting, no crowds',
        sequence: [
          {
            timestamp: '[00:00-00:02]',
            shot_description:
              'Medium shot from behind a young female explorer with a leather satchel and messy brown hair in a ponytail, as she pushes aside a large jungle vine to reveal a hidden path.',
            emotion: 'Wonder and reverence',
            sfx: 'The rustle of dense leaves, distant exotic bird calls',
          },
          {
            timestamp: '[00:02-00:04]',
            shot_description:
              "Reverse shot of the explorer's freckled face, her expression filled with awe as she gazes upon ancient, moss-covered ruins in the background.",
            emotion: '',
            sfx: 'The rustle of dense leaves, distant exotic bird calls',
          },
          {
            timestamp: '[00:04-00:06]',
            shot_description:
              'Tracking shot following the explorer as she steps into the clearing and runs her hand over the intricate carvings on a crumbling stone wall.',
            emotion: 'Wonder and reverence',
            sfx: '',
          },
          {
            timestamp: '[00:06-00:08]',
            shot_description:
              'Wide, high-angle crane shot, revealing the lone explorer standing small in the center of the vast, forgotten temple complex, half-swallowed by the jungle.',
            emotion: 'Wonder and reverence',
            sfx: 'A swelling, gentle orchestral score begins to play',
          },
        ],
        creative_controls: {
          mode: 'text-to-video',
          notes: '',
        },
        notes: 'Example from official Veo 3.1 documentation - Timestamp Prompting workflow',
      },
    },
  },
  {
    id: 'noir-detective',
    name: 'Film Noir Detective',
    description: 'Dialogue scene with Ingredients-to-Video workflow from official docs',
    icon: '🕵️',
    category: 'dialogue',
    template: {
      video_length: 8,
      resolution: '1080p',
      aspect_ratio: '16:9',
      prompt: {
        cinematography: {
          camera_movement: 'Shot-reverse-shot with subtle push-in',
          composition: 'Medium shot, reverse shot focusing on each character',
          lens_and_focus: 'Shallow depth of field, rack focus between characters',
        },
        subject: 'Tired detective and mysterious woman in 1940s noir office',
        action: 'Detective and woman exchange dialogue, woman enters office',
        context:
          'Cluttered 1940s detective office with desk, paperwork, harsh fluorescent lights, green monochrome monitor glow',
        style_and_ambiance:
          'Film noir, moody, dramatic lighting, retro 1980s aesthetic with color film grain',
        audio: {
          dialogue: [
            {
              character: 'Detective',
              speech: 'Of all the offices in this town, you had to walk into mine.',
              voice_description: 'in a weary voice',
            },
            {
              character: 'Woman',
              speech: 'You were highly recommended.',
              voice_description: 'with a slight, mysterious smile',
            },
          ],
          sound_effects: ['Door creaking open', 'Papers shuffling on desk', 'Chair creaking'],
          ambient_noise:
            'Quiet office ambience, distant city sounds through window, ceiling fan humming softly',
        },
        negative_prompt:
          'No unnatural lip movements, no robotic expressions, no modern elements, no bright cheerful lighting',
        sequence: [
          {
            timestamp: '[00:00-00:03]',
            shot_description:
              'Medium shot of the detective behind his desk. He looks up at the woman. Natural light from window creates dramatic side lighting.',
            emotion: 'Resignation mixed with curiosity',
            sfx: 'Door creaking open, papers shuffling',
          },
          {
            timestamp: '[00:03-00:05]',
            shot_description:
              'Reverse shot focusing on the woman. Soft focus on detective in background. A slight, mysterious smile plays on her lips as she replies.',
            emotion: 'Confidence and mystery',
            sfx: 'Her footsteps entering room',
          },
          {
            timestamp: '[00:05-00:08]',
            shot_description:
              'Two-shot with rack focus. Detective leans back in chair, studying her. Camera slowly pushes in on both characters.',
            emotion: 'Tension and intrigue building',
            sfx: 'Chair creaking',
          },
        ],
        creative_controls: {
          mode: 'ingredients-to-video',
          reference_images: [
            'Detective character reference',
            'Woman character reference',
            'Office setting reference',
          ],
          notes:
            'Use provided images for the detective, the woman, and the office setting to maintain consistent aesthetic across shots',
        },
        notes:
          'Example from official Veo 3.1 documentation - Building a dialogue scene with Ingredients to Video. Maintain eye-line consistency and ensure lip-sync accuracy.',
      },
    },
  },
  {
    id: 'pop-star-concert',
    name: 'Pop Star Concert',
    description: 'Dynamic 180-degree camera transition with First & Last Frame from official docs',
    icon: '🎤',
    category: 'cinematic',
    template: {
      video_length: 8,
      resolution: '1080p',
      aspect_ratio: '16:9',
      prompt: {
        cinematography: {
          camera_movement: 'Smooth 180-degree arc shot circling around singer',
          composition: 'Starting medium shot front-facing, ending POV shot from behind',
          lens_and_focus: 'Dramatic spotlight creating lens flare, wide-angle for crowd',
        },
        subject: 'Female pop star singing passionately into vintage microphone on stage',
        action:
          'Camera performs 180-degree arc around singer while she sings, revealing massive crowd',
        context:
          'Dark concert stage with single dramatic spotlight, massive cheering crowd visible from behind',
        style_and_ambiance:
          'Cinematic, dramatic, high-energy concert atmosphere, lens flare, emotional moment',
        audio: {
          dialogue: [
            {
              character: 'Singer',
              speech: 'when you look me in the eyes, I can see a million stars',
              voice_description: 'singing passionately',
            },
          ],
          sound_effects: ['Roaring crowd cheers', 'Stage lighting effects'],
          ambient_noise: 'Large concert venue ambience, crowd energy, spatial reverb',
        },
        negative_prompt:
          'No empty audience, no bad lighting, no amateur staging, no distorted faces',
        sequence: [
          {
            timestamp: '[00:00-00:02]',
            shot_description:
              'Medium shot of a female pop star singing passionately into a vintage microphone. She is on a dark stage, lit by a single, dramatic spotlight from the front. She has her eyes closed, capturing an emotional moment.',
            emotion: 'Passionate and emotional',
            sfx: 'Crowd ambience building',
          },
          {
            timestamp: '[00:02-00:06]',
            shot_description:
              'The camera performs a smooth 180-degree arc shot, starting with the front-facing view of the singer and circling around her to seamlessly end on the POV shot from behind her on stage. The singer continues performing.',
            emotion: 'Building energy and anticipation',
            sfx: '',
          },
          {
            timestamp: '[00:06-00:08]',
            shot_description:
              "POV shot from behind the singer on stage, looking out at a large, cheering crowd. The stage lights are bright, creating lens flare. You can see the back of the singer's head and shoulders in the foreground. The audience is a sea of lights and silhouettes.",
            emotion: 'Triumphant and awe-inspiring',
            sfx: 'Massive crowd roar',
          },
        ],
        creative_controls: {
          mode: 'first-last-frame',
          reference_images: [
            'First frame: Front view of singer with spotlight',
            'Last frame: POV from behind singer viewing crowd',
          ],
          notes:
            'Use First and Last Frame feature - provide front-facing shot of singer as first frame and POV behind singer as last frame. Veo will generate smooth 180-degree transition.',
        },
        notes:
          'Example from official Veo 3.1 documentation - The dynamic transition with First and Last Frame workflow. Camera movement should be perfectly smooth arc.',
      },
    },
  },
];
