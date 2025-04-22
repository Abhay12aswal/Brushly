import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import PaintingDetail from "./PaintingDetail";
import { dummyPaintings } from "@/lib/dummy-data";

interface PaintingGridProps {
  activeTab: string;
  searchQuery: string;
}

export default function PaintingGrid({
  activeTab,
  searchQuery,
}: PaintingGridProps) {
  const [selectedPainting, setSelectedPainting] = useState<number | null>(null);
  const [likedPaintings, setLikedPaintings] = useState<number[]>([]);

  // Filter paintings based on active tab and search query
  const filteredPaintings = dummyPaintings.filter((painting) => {
    if (
      searchQuery &&
      !painting.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !painting.artist.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (activeTab === "explore") {
      return painting.category === "trending";
    }

    return true;
  });

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPaintings((prev) =>
      prev.includes(id)
        ? prev.filter((paintingId) => paintingId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPaintings.map((painting, index) => (
          <motion.div
            key={painting.id}
            layoutId={`painting-${painting.id}`}
            onClick={() => setSelectedPainting(painting.id)}
            className="cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative group">
              <img
                src={painting.imageUrl || "/placeholder.svg"}
                alt={painting.title}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm font-semibold truncate">
                    {painting.title}
                  </h3>
                  <p className="text-xs opacity-90">{painting.artist}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  onClick={(e) => toggleLike(painting.id, e)}
                  className={`p-1.5 rounded-full bg-white bg-opacity-80 ${
                    likedPaintings.includes(painting.id)
                      ? "text-red-500"
                      : "text-gray-700"
                  }`}
                >
                  <Heart
                    size={16}
                    className={
                      likedPaintings.includes(painting.id) ? "fill-current" : ""
                    }
                  />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="p-1.5 rounded-full bg-white bg-opacity-80 text-gray-700"
                >
                  <Share2 size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPainting !== null && (
        <PaintingDetail
          painting={dummyPaintings.find((p) => p.id === selectedPainting)!}
          onClose={() => setSelectedPainting(null)}
          isLiked={likedPaintings.includes(selectedPainting)}
          onToggleLike={() => {
            setLikedPaintings((prev) =>
              prev.includes(selectedPainting)
                ? prev.filter((id) => id !== selectedPainting)
                : [...prev, selectedPainting]
            );
          }}
        />
      )}
    </>
  );
}
