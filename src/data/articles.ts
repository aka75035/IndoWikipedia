export type Article = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
};

export const articles = [
  {
    slug: "ashoka",
    title: "Ashoka",
    summary: "Emperor of the Maurya Empire",
    content: "Ashoka was one of the greatest rulers...",
    image: "/images/ashoka.jpg",
    category: "History"
  },
  {
    slug: "taj-mahal",
    title: "Taj Mahal",
    summary: "A UNESCO World Heritage Site",
    content: "The Taj Mahal is located in Agra...",
    image: "/images/taj-mahal.jpg",
    category: "Culture"

  },{
    slug: "india-gate",
    title: "India Gate",
    summary: "Emperor of the Maurya Empire",
    content: "Ashoka was one of the greatest rulers...",
    image: "/images/taj-mahal.jpg",
    category: "Pride"
  },
  {
    slug: "gate-way-of-india",
    title: "Gate Way of India",
    summary: "A UNESCO World Heritage Site",
    content: "The Taj Mahal is located in Agra...",
    image: "/images/taj-mahal.jpg",
    category: "Pride"
  },{
    slug: "qutub-minar",
    title: "Qutub Minar",
    summary: "Emperor of the Maurya Empire",
    content: "Ashoka was one of the greatest rulers...",
    image: "/images/taj-mahal.jpg",
    category: "History"
  },
  {
    slug: "red-fort",
    title: "Red Fort",
    summary: "A UNESCO World Heritage Site",
    content: "The Taj Mahal is located in Agra...",
    image: "/images/taj-mahal.jpg",
    category: "History"
  }
];