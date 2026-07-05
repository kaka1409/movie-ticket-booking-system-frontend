export const DATES = [
  { label: "JULY", day: "12", value: "2026-07-12" },
  { label: "JULY", day: "13", value: "2026-07-13" },
  { label: "JULY", day: "14", value: "2026-07-14" },
  { label: "JULY", day: "15", value: "2026-07-15" },
  { label: "JULY", day: "16", value: "2026-07-16" },
  { label: "JULY", day: "17", value: "2026-07-17" },
  { label: "JULY", day: "18", value: "2026-07-18" },
  { label: "JULY", day: "19", value: "2026-07-19" },
  { label: "JULY", day: "20", value: "2026-07-20" },
  { label: "JULY", day: "21", value: "2026-07-21" },
];

export const CINEMAS = [
  {
    id: 1,
    name: "AMC Empire 25",
    distance: "2.1 mi away",
    badge: "IMAX 70MM",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    times: ["11:30 AM", "2:45 PM", "6:15 PM", "9:30 PM"],
  },
  {
    id: 2,
    name: "Regal Union Square",
    distance: "3.4 mi away",
    badge: "STANDARD",
    badgeColor: "bg-(--color-border) text-(--color-text-secondary)",
    times: ["12:15 PM", "3:30 PM", "7:00 PM", "10:15 PM"],
  },
  {
    id: 3,
    name: "Cinemark Downtown",
    distance: "4.0 mi away",
    badge: "IMAX",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    times: ["10:45 AM", "1:15 PM", "4:00 PM", "7:30 PM", "10:00 PM"],
  },
  {
    id: 4,
    name: "AMC Lincoln Square",
    distance: "5.2 mi away",
    badge: "DOLBY ATMOS",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    times: ["11:00 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
  },
  {
    id: 5,
    name: "Regal Battery Park",
    distance: "6.8 mi away",
    badge: "STANDARD",
    badgeColor: "bg-(--color-border) text-(--color-text-secondary)",
    times: ["12:00 PM", "3:15 PM", "6:45 PM", "9:45 PM"],
  },
  {
    id: 6,
    name: "Showcase Cinemas",
    distance: "8.1 mi away",
    badge: "PREMIUM",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    times: ["10:30 AM", "1:45 PM", "4:30 PM", "7:15 PM", "10:30 PM"],
  },
];

export const INITIAL_CINEMAS_VISIBLE = 2;

export const RATING_BREAKDOWN = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 1 },
];

export const REVIEWS = [
  {
    id: 1,
    user: "Alex M.",
    src: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    time: "2 days ago",
    text: "A visual masterpiece. Denis Villeneuve has created something truly spectacular. The sound design alone is worth experiencing in IMAX. Absolutely blew me away.",
  },
  {
    id: 2,
    user: "Sarah K.",
    src: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    time: "1 week ago",
    text: "Great continuation of the story. The pacing was a bit slow in the middle, but the climax more than made up for it. Austin Butler was terrifying.",
  },
  {
    id: 3,
    user: "James L.",
    src: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    time: "1 week ago",
    text: "One of the best movie experiences I have had this year. The character development is phenomenal and the plot twists kept me on the edge of my seat the entire time.",
  },
  {
    id: 4,
    user: "Maria G.",
    src: "https://i.pravatar.cc/150?img=9",
    rating: 3,
    time: "2 weeks ago",
    text: "Decent movie but nothing groundbreaking. The acting was solid but the story felt predictable at times. Worth a watch but not a must-see.",
  },
  {
    id: 5,
    user: "David W.",
    src: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    time: "2 weeks ago",
    text: "Absolutely loved every minute of it. The direction, the score, the performances — everything came together perfectly. This is cinema at its finest.",
  },
  {
    id: 6,
    user: "Emily R.",
    src: "https://i.pravatar.cc/150?img=16",
    rating: 4,
    time: "3 weeks ago",
    text: "Really enjoyable film with great chemistry between the leads. The third act was especially strong. Minor pacing issues in the second act but overall a great time.",
  },
  {
    id: 7,
    user: "Tom H.",
    src: "https://i.pravatar.cc/150?img=12",
    rating: 2,
    time: "3 weeks ago",
    text: "Had high expectations but was let down. The trailer made it look better than it actually was. Some good moments but overall felt disjointed and rushed.",
  },
  {
    id: 8,
    user: "Lisa P.",
    src: "https://i.pravatar.cc/150?img=20",
    rating: 5,
    time: "1 month ago",
    text: "A triumph of storytelling. I was moved to tears multiple times. The ensemble cast delivered career-best performances. Already planning to see it again.",
  },
  {
    id: 9,
    user: "Chris B.",
    src: "https://i.pravatar.cc/150?img=14",
    rating: 4,
    time: "1 month ago",
    text: "Solid filmmaking from start to finish. The action sequences were thrilling and the quieter moments were just as compelling. Highly recommended.",
  },
  {
    id: 10,
    user: "Anna T.",
    src: "https://i.pravatar.cc/150?img=24",
    rating: 3,
    time: "1 month ago",
    text: "Good but not great. The visual effects were stunning but I felt the emotional core of the story was missing. Still worth watching for the spectacle alone.",
  },
];

export const INITIAL_REVIEWS_VISIBLE = 3;
export const REVIEWS_LOAD_MORE = 3;
