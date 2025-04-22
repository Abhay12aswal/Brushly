
import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, MessageCircle, Share2, Download, BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import type { Painting } from "@/lib/dummy-data"

interface PaintingDetailProps {
  painting: Painting
  onClose: () => void
  isLiked: boolean
  onToggleLike: () => void
}

export default function PaintingDetail({ painting, onClose, isLiked, onToggleLike }: PaintingDetailProps) {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(painting.comments || [])

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        user: "You",
        avatar: "/placeholder-user.jpg",
        text: comment,
        timestamp: new Date().toISOString(),
      }
      setComments([...comments, newComment])
      setComment("")
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
        onClick={onClose}
      >
        <motion.div
          layoutId={`painting-${painting.id}`}
          className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full md:w-1/2 bg-gray-100">
            <img
              src={painting.imageUrl || "/placeholder.svg"}
              alt={painting.title}
              className="w-full h-full object-contain"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>

          <div className="w-full md:w-1/2 flex flex-col h-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={painting.artistAvatar} alt={painting.artist} />
                    <AvatarFallback>{painting.artist.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{painting.artist}</h3>
                    <p className="text-sm text-gray-500">{painting.location}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Follow
                </Button>
              </div>

              <h2 className="text-xl font-bold mb-2">{painting.title}</h2>
              <p className="text-gray-700 mb-4">{painting.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <motion.button whileTap={{ scale: 1.2 }} onClick={onToggleLike} className="flex items-center text-sm">
                    <Heart size={20} className={`mr-1 ${isLiked ? "text-red-500 fill-current" : "text-gray-700"}`} />
                    <span>{painting.likes + (isLiked ? 1 : 0)}</span>
                  </motion.button>
                  <button className="flex items-center text-sm text-gray-700">
                    <MessageCircle size={20} className="mr-1" />
                    <span>{comments.length}</span>
                  </button>
                  <button className="flex items-center text-sm text-gray-700">
                    <Share2 size={20} className="mr-1" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <BookmarkPlus size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Download size={20} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-semibold mb-4">Comments</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex">
                    <Avatar className="h-8 w-8 mr-3 mt-1">
                      <AvatarImage src={comment.avatar} alt={comment.user} />
                      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <p className="font-medium text-sm">{comment.user}</p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                        <span>Reply</span>
                        <span>•</span>
                        <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleAddComment} className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="You" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <Input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 rounded-full"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button type="submit" variant="ghost" size="sm" className="ml-2">
                  Post
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

