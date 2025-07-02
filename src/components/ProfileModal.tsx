// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import type { User } from "@/types/types"

// interface ProfileModalProps {
//   isOpen: boolean
//   onClose: () => void
//   user: User
//   onUpdate: (user: Partial<User>) => void
// }

// export default function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
//   const [formData, setFormData] = useState({
//     name: user.name,
//     email: user.email,
//   })

//   useEffect(() => {
//     setFormData({
//       name: user.name,
//       email: user.email,
//     })
//   }, [user])

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onUpdate(formData)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Profile Settings</DialogTitle>
//           <DialogDescription>Update your personal information and preferences</DialogDescription>
//         </DialogHeader>

//         <div className="flex items-center space-x-4 py-4">
//           <Avatar className="h-16 w-16">
//             <AvatarImage src={user.avatar || "/placeholder.svg"} />
//             <AvatarFallback className="bg-blue-600 text-white text-lg">
//               {user.name
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-semibold">{user.name}</h3>
//             <p className="text-sm text-gray-600">{user.email}</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="name">Full Name</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email Address</Label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//               Save Changes
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
