import { NOW_SHOWING } from "@/features/movies/mock";

const findMovie = (title: string) =>
  NOW_SHOWING.find((m) => m.title === title)!;

export const FEATURED_MOVIES = [
  {
    ...findMovie("Interstellar"),
    label: "Featured Today",
    description:
      "Journey through the unknown reaches of the galaxy in this award-winning cinematic masterpiece that redefines the science fiction genre.",
  },
  {
    ...findMovie("Avengers"),
    label: "Now Playing",
    description:
      "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
  },
  {
    ...findMovie("Inception"),
    label: "Critic's Choice",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    ...findMovie("The Dark Knight"),
    label: "Popular Pick",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
];
