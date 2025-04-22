export interface Comment {
    id: number
    user: string
    avatar: string
    text: string
    timestamp: string
  }
  
  export interface Painting {
    id: number
    title: string
    artist: string
    artistAvatar: string
    description: string
    imageUrl: string
    category: string
    likes: number
    location: string
    comments: Comment[]
  }
  
  export const dummyPaintings: Painting[] = [
    {
      id: 1,
      title: "Starry Night",
      artist: "Vincent van Gogh",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "This famous painting depicts the view from the east-facing window of Van Gogh's asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=Starry+Night",
      category: "trending",
      likes: 1243,
      location: "Museum of Modern Art, New York",
      comments: [
        {
          id: 101,
          user: "ArtLover42",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "This is my absolute favorite painting of all time!",
          timestamp: "2023-05-15T14:22:00Z",
        },
        {
          id: 102,
          user: "GalleryVisitor",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The swirls in the sky are so mesmerizing.",
          timestamp: "2023-05-16T09:15:00Z",
        },
      ],
    },
    {
      id: 2,
      title: "The Persistence of Memory",
      artist: "Salvador Dalí",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "One of the most recognizable works of Surrealism, this painting depicts melting watches in a desert landscape.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=The+Persistence+of+Memory",
      category: "surrealism",
      likes: 987,
      location: "Museum of Modern Art, New York",
      comments: [
        {
          id: 201,
          user: "SurrealismFan",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The melting clocks represent the relativity of time!",
          timestamp: "2023-04-10T16:45:00Z",
        },
      ],
    },
    {
      id: 3,
      title: "Girl with a Pearl Earring",
      artist: "Johannes Vermeer",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "This tronie depicts a European girl wearing an exotic dress, an oriental turban, and a large pearl earring.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=Girl+with+a+Pearl+Earring",
      category: "trending",
      likes: 1056,
      location: "Mauritshuis, The Hague",
      comments: [
        {
          id: 301,
          user: "DutchArtFan",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The way Vermeer captured light is unmatched!",
          timestamp: "2023-03-22T11:30:00Z",
        },
      ],
    },
    {
      id: 4,
      title: "The Scream",
      artist: "Edvard Munch",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "This expressionist painting depicts a figure with an agonized expression against a landscape with a tumultuous orange sky.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=The+Scream",
      category: "expressionism",
      likes: 876,
      location: "National Gallery, Oslo",
      comments: [
        {
          id: 401,
          user: "ArtHistorian",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "A perfect representation of anxiety in modern times.",
          timestamp: "2023-02-18T13:20:00Z",
        },
      ],
    },
    {
      id: 5,
      title: "Water Lilies",
      artist: "Claude Monet",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "Part of a series of approximately 250 oil paintings depicting Monet's flower garden at his home in Giverny.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=Water+Lilies",
      category: "impressionism",
      likes: 1122,
      location: "Musée de l'Orangerie, Paris",
      comments: [
        {
          id: 501,
          user: "ImpressionismLover",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The colors are so vibrant and peaceful!",
          timestamp: "2023-01-05T10:15:00Z",
        },
      ],
    },
    {
      id: 6,
      title: "The Night Watch",
      artist: "Rembrandt",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "This large painting shows a company of civic guardsmen. It is renowned for its effective use of light and shadow.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=The+Night+Watch",
      category: "baroque",
      likes: 932,
      location: "Rijksmuseum, Amsterdam",
      comments: [
        {
          id: 601,
          user: "DutchMaster",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The composition and lighting are revolutionary for its time!",
          timestamp: "2023-06-12T09:45:00Z",
        },
      ],
    },
    {
      id: 7,
      title: "The Birth of Venus",
      artist: "Sandro Botticelli",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "This iconic painting depicts the goddess Venus arriving at the shore after her birth, when she had emerged from the sea fully-grown.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=The+Birth+of+Venus",
      category: "renaissance",
      likes: 1087,
      location: "Uffizi Gallery, Florence",
      comments: [
        {
          id: 701,
          user: "RenaissanceScholar",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The mythological symbolism is fascinating!",
          timestamp: "2023-05-28T14:10:00Z",
        },
      ],
    },
    {
      id: 8,
      title: "Guernica",
      artist: "Pablo Picasso",
      artistAvatar: "/placeholder.svg?height=50&width=50",
      description:
        "This powerful anti-war painting was created in response to the bombing of Guernica, a Basque Country town in northern Spain, by Nazi Germany and Fascist Italy.",
      imageUrl: "/placeholder.svg?height=600&width=450&text=Guernica",
      category: "trending",
      likes: 1245,
      location: "Museo Reina Sofía, Madrid",
      comments: [
        {
          id: 801,
          user: "ModernArtFan",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "One of the most powerful anti-war statements in art history.",
          timestamp: "2023-04-17T16:30:00Z",
        },
      ],
    },
  ]
  
  