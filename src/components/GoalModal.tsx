// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Sparkles, X } from "lucide-react"
// import type { Goal, Group } from "@/types/types"

// interface GoalModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSubmit: (goal: Partial<Goal>) => void
//   groups: Group[]
//   goal?: Goal | null
//   onUpdate?: (goalId: string, updates: Partial<Goal>) => void
// }

// const categoryColors = {
//   Finance: "bg-green-500",
//   Travel: "bg-orange-500",
//   Family: "bg-pink-500",
//   Personal: "bg-indigo-500",
//   Professional: "bg-purple-500",
// }

// const aiSuggestions = {
//   Finance: [
//     "Build emergency fund of $10,000",
//     "Save for retirement - contribute $500/month",
//     "Pay off credit card debt",
//     "Save for house down payment",
//     "Create investment portfolio",
//   ],
//   Travel: [
//     "Visit Japan and experience cherry blossoms",
//     "Backpack through Europe for 3 weeks",
//     "Take a family trip to Disney World",
//     "Go on an African safari adventure",
//     "Explore the Northern Lights in Iceland",
//   ],
//   Family: [
//     "Plan weekly family game nights",
//     "Create a family photo album",
//     "Organize annual family reunion",
//     "Start a family garden together",
//     "Take cooking classes as a family",
//   ],
//   Personal: [
//     "Read 24 books this year",
//     "Learn a new language fluently",
//     "Run a half marathon",
//     "Practice meditation daily",
//     "Learn to play guitar",
//   ],
//   Professional: [
//     "Get promoted to senior position",
//     "Complete professional certification",
//     "Build a personal brand online",
//     "Network with 50 industry professionals",
//     "Launch a side business",
//   ],
// }

// export default function GoalModal({ isOpen, onClose, onSubmit, groups, goal, onUpdate }: GoalModalProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "" as Goal["category"] | "",
//     targetAmount: "",
//     currentAmount: "",
//     targetDate: "",
//     isPersonal: false,
//     groupId: "",
//   })
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)

//   useEffect(() => {
//     if (goal) {
//       setFormData({
//         title: goal.title,
//         description: goal.description,
//         category: goal.category,
//         targetAmount: goal.targetAmount.toString(),
//         currentAmount: goal.currentAmount.toString(),
//         targetDate: goal.targetDate.toISOString().split("T")[0],
//         isPersonal: goal.isPersonal,
//         groupId: goal.groupId,
//       })
//       setIsEditing(true)
//     } else {
//       setFormData({
//         title: "",
//         description: "",
//         category: "",
//         targetAmount: "",
//         currentAmount: "0",
//         targetDate: "",
//         isPersonal: false,
//         groupId: groups[0]?.id || "",
//       })
//       setIsEditing(false)
//     }
//   }, [goal, groups])

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (isEditing && goal && onUpdate) {
//       onUpdate(goal.id, {
//         title: formData.title,
//         description: formData.description,
//         category: formData.category as Goal["category"],
//         targetAmount: Number.parseFloat(formData.targetAmount),
//         currentAmount: Number.parseFloat(formData.currentAmount),
//         targetDate: new Date(formData.targetDate),
//         isPersonal: formData.isPersonal,
//         groupId: formData.groupId,
//       })
//     } else {
//       onSubmit({
//         title: formData.title,
//         description: formData.description,
//         category: formData.category as Goal["category"],
//         targetAmount: Number.parseFloat(formData.targetAmount),
//         targetDate: new Date(formData.targetDate),
//         isPersonal: formData.isPersonal,
//         groupId: formData.groupId,
//       })
//     }

//     onClose()
//   }

//   const handleSuggestionClick = (suggestion: string) => {
//     setFormData({ ...formData, title: suggestion })
//     setShowSuggestions(false)
//   }

//   const progress = goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <span>{isEditing ? "Edit Goal" : "Create New Goal"}</span>
//             {isEditing && goal && (
//               <Badge className={`${categoryColors[goal.category]} text-white`}>{goal.category}</Badge>
//             )}
//           </DialogTitle>
//           <DialogDescription>
//             {isEditing
//               ? "Update your goal details and track progress"
//               : "Set a new goal and start your journey to success"}
//           </DialogDescription>
//         </DialogHeader>

//         {isEditing && goal && (
//           <div className="bg-gray-50 p-4 rounded-lg mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium">Current Progress</span>
//               <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
//             </div>
//             <Progress value={progress} className="h-2 mb-2" />
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>${goal.currentAmount.toLocaleString()}</span>
//               <span>${goal.targetAmount.toLocaleString()}</span>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="category">Category</Label>
//             <Select
//               value={formData.category}
//               onValueChange={(value) => {
//                 setFormData({ ...formData, category: value as Goal["category"] })
//                 setShowSuggestions(false)
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Finance">💰 Finance</SelectItem>
//                 <SelectItem value="Travel">✈️ Travel</SelectItem>
//                 <SelectItem value="Family">👨‍👩‍👧‍👦 Family</SelectItem>
//                 <SelectItem value="Personal">🎯 Personal</SelectItem>
//                 <SelectItem value="Professional">💼 Professional</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="title">Goal Title</Label>
//               {formData.category && !isEditing && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowSuggestions(!showSuggestions)}
//                   className="text-blue-600 border-blue-200 hover:bg-blue-50"
//                 >
//                   <Sparkles className="h-4 w-4 mr-1" />
//                   AI Suggestions
//                 </Button>
//               )}
//             </div>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               placeholder="Enter your goal title"
//               required
//             />

//             {showSuggestions && formData.category && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-blue-800">AI Suggestions for {formData.category}</span>
//                   <Button type="button" variant="ghost" size="sm" onClick={() => setShowSuggestions(false)}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="space-y-1">
//                   {aiSuggestions[formData.category as keyof typeof aiSuggestions].map((suggestion, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() => handleSuggestionClick(suggestion)}
//                       className="block w-full text-left text-sm p-2 rounded hover:bg-blue-100 text-blue-700 transition-colors"
//                     >
//                       {suggestion}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               placeholder="Describe your goal in detail"
//               rows={3}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="targetAmount">Target Amount ($)</Label>
//               <Input
//                 id="targetAmount"
//                 type="number"
//                 value={formData.targetAmount}
//                 onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
//                 placeholder="0"
//                 required
//               />
//             </div>

//             {isEditing && (
//               <div className="space-y-2">
//                 <Label htmlFor="currentAmount">Current Amount ($)</Label>
//                 <Input
//                   id="currentAmount"
//                   type="number"
//                   value={formData.currentAmount}
//                   onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
//                   placeholder="0"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="targetDate">Target Date</Label>
//             <Input
//               id="targetDate"
//               type="date"
//               value={formData.targetDate}
//               onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
//               required
//             />
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Goal Visibility</Label>
//                 <p className="text-sm text-gray-600">
//                   {formData.isPersonal ? "Only you can see this goal" : "Visible to group members"}
//                 </p>
//               </div>
//               <Switch
//                 checked={formData.isPersonal}
//                 onCheckedChange={(checked) => setFormData({ ...formData, isPersonal: checked })}
//               />
//             </div>

//             {!formData.isPersonal && (
//               <div className="space-y-2">
//                 <Label htmlFor="group">Select Group</Label>
//                 <Select
//                   value={formData.groupId}
//                   onValueChange={(value) => setFormData({ ...formData, groupId: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose a group" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {groups.map((group) => (
//                       <SelectItem key={group.id} value={group.id}>
//                         <div className="flex items-center space-x-2">
//                           <div className={`w-3 h-3 rounded-full ${group.color}`} />
//                           <span>{group.name}</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//               {isEditing ? "Update Goal" : "Create Goal"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
