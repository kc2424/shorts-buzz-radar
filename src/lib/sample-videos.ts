export interface SampleVideo {
  id: string;
  title: string;
  channelName: string;
  views: number;
}

/** デモ・シード用の実在 Shorts（公開動画） */
export const SAMPLE_VIDEO_POOL: SampleVideo[] = [
  {
    id: "jNQXAC9IVRw",
    title: "Me at the zoo",
    channelName: "jawed",
    views: 378_000_000,
  },
  {
    id: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE",
    channelName: "officialpsy",
    views: 5_200_000_000,
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Despacito",
    channelName: "Luis Fonsi",
    views: 8_800_000_000,
  },
  {
    id: "RgKAFK5djSk",
    title: "See You Again",
    channelName: "Wiz Khalifa",
    views: 6_700_000_000,
  },
  {
    id: "OPf0YbXqDm0",
    title: "Uptown Funk",
    channelName: "Mark Ronson",
    views: 5_500_000_000,
  },
  {
    id: "y6120QOlsfU",
    title: "Sandstorm",
    channelName: "Darude",
    views: 62_000_000,
  },
  {
    id: "L_jWHffIx5E",
    title: "Smells Like Teen Spirit",
    channelName: "Nirvana",
    views: 1_800_000_000,
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Bohemian Rhapsody",
    channelName: "Queen Official",
    views: 1_900_000_000,
  },
  {
    id: "hTWKbfoikeg",
    title: "Numb",
    channelName: "Linkin Park",
    views: 1_600_000_000,
  },
  {
    id: "09839DpTctU",
    title: "Shape of You",
    channelName: "Ed Sheeran",
    views: 6_300_000_000,
  },
  {
    id: "60ItHLz5WEA",
    title: "Faded",
    channelName: "Alan Walker",
    views: 3_700_000_000,
  },
  {
    id: "CevxZvSJLk8",
    title: "Roar",
    channelName: "Katy Perry",
    views: 3_900_000_000,
  },
  {
    id: "YQHsXMglC9A",
    title: "Hello",
    channelName: "Adele",
    views: 3_800_000_000,
  },
  {
    id: "09R8_2nJtjg",
    title: "Sugar",
    channelName: "Maroon 5",
    views: 4_000_000_000,
  },
  {
    id: "lp-EO5I60KA",
    title: "Thinking Out Loud",
    channelName: "Ed Sheeran",
    views: 3_600_000_000,
  },
  {
    id: "RB-RcX5DS5A",
    title: "Don't Stop Believin'",
    channelName: "Journey",
    views: 1_200_000_000,
  },
  {
    id: "uelHwf8o7_U",
    title: "Wrecking Ball",
    channelName: "Miley Cyrus",
    views: 1_100_000_000,
  },
  {
    id: "450p7goxZqg",
    title: "All of Me",
    channelName: "John Legend",
    views: 2_400_000_000,
  },
  {
    id: "Zi_XLOBDo_Y",
    title: "Lean On",
    channelName: "Major Lazer",
    views: 3_500_000_000,
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Perfect",
    channelName: "Ed Sheeran",
    views: 3_400_000_000,
  },
];

export function poolIndex(seed: number, offset = 0): number {
  return Math.abs(seed + offset) % SAMPLE_VIDEO_POOL.length;
}

export function videoFromPool(seed: number, offset = 0): SampleVideo {
  return SAMPLE_VIDEO_POOL[poolIndex(seed, offset)]!;
}
