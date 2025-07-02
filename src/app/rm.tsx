// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Plus, Target, Users, TrendingUp, Calendar, Settings, Bell, Search } from "lucide-react"
// import GoalModal from "@/components/GoalModal"
// import GroupModal from "@/components/GroupModal"
// import ProfileModal from "@/components/ProfileModal"


// import GoalChart from "@/components/GoalChart"
// import CategoryChart from "@/components/CategoryChart"
// import QuickActions from "@/components/QuickActions"
// import type { Goal, Group, User } from "@/types/types"

// // Dummy data
// const dummyUser: User = {
//   id: "1",
//   name: "Alex Johnson",
//   email: "alex@example.com",
//   avatar: "/placeholder.svg?height=40&width=40",
//   groups: ["1", "2"],
// }

// const dummyGroups: Group[] = [
//   {
//     id: "1",
//     name: "Family Goals",
//     description: "Our family objectives for 2024",
//     members: ["1", "2", "3"],
//     color: "bg-blue-500",
//     createdAt: new Date("2024-01-01"),
//   },
//   {
//     id: "2",
//     name: "Work Team",
//     description: "Professional development goals",
//     members: ["1", "4", "5"],
//     color: "bg-purple-500",
//     createdAt: new Date("2024-01-15"),
//   },
// ]

// const dummyGoals: Goal[] = [
//   {
//     id: "1",
//     title: "Save $10,000 for Emergency Fund",
//     description: "Build a solid financial foundation",
//     category: "Finance",
//     targetAmount: 10000,
//     currentAmount: 6500,
//     targetDate: new Date("2024-12-31"),
//     isPersonal: false,
//     groupId: "1",
//     userId: "1",
//     status: "active",
//     createdAt: new Date("2024-01-01"),
//   },
//   {
//     id: "2",
//     title: "Visit Japan",
//     description: "Experience Japanese culture and cuisine",
//     category: "Travel",
//     targetAmount: 5000,
//     currentAmount: 2800,
//     targetDate: new Date("2024-08-15"),
//     isPersonal: true,
//     groupId: "1",
//     userId: "1",
//     status: "active",
//     createdAt: new Date("2024-02-01"),
//   },
//   {
//     id: "3",
//     title: "Learn React Native",
//     description: "Master mobile app development",
//     category: "Professional",
//     targetAmount: 100,
//     currentAmount: 45,
//     targetDate: new Date("2024-06-30"),
//     isPersonal: false,
//     groupId: "2",
//     userId: "1",
//     status: "active",
//     createdAt: new Date("2024-03-01"),
//   },
//   {
//     id: "4",
//     title: "Family Vacation Fund",
//     description: "Save for our annual family trip",
//     category: "Family",
//     targetAmount: 8000,
//     currentAmount: 8000,
//     targetDate: new Date("2024-07-01"),
//     isPersonal: false,
//     groupId: "1",
//     userId: "1",
//     status: "completed",
//     createdAt: new Date("2024-01-10"),
//   },
// ]

// const categoryColors = {
//   Finance: "bg-green-500",
//   Travel: "bg-orange-500",
//   Family: "bg-pink-500",
//   Personal: "bg-indigo-500",
//   Professional: "bg-purple-500",
// }

// export default function Dashboard() {
//   const [goals, setGoals] = useState<Goal[]>(dummyGoals)
//   const [groups, setGroups] = useState<Group[]>(dummyGroups)
//   const [user, setUser] = useState<User>(dummyUser)
//   const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
//   const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//   const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

//   const activeGoals = goals.filter((goal) => goal.status === "active")
//   const completedGoals = goals.filter((goal) => goal.status === "completed")
//   const totalProgress =
//     activeGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100, 0) / activeGoals.length

//   const handleCreateGoal = (goalData: Partial<Goal>) => {
//     const newGoal: Goal = {
//       id: Date.now().toString(),
//       title: goalData.title!,
//       description: goalData.description!,
//       category: goalData.category!,
//       targetAmount: goalData.targetAmount!,
//       currentAmount: 0,
//       targetDate: goalData.targetDate!,
//       isPersonal: goalData.isPersonal!,
//       groupId: goalData.groupId!,
//       userId: user.id,
//       status: "active",
//       createdAt: new Date(),
//     }
//     setGoals([...goals, newGoal])
//     setIsGoalModalOpen(false)
//   }

//   const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
//     setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)))
//   }


//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Target className="h-8 w-8 text-blue-600" />
//                 <h1 className="text-xl font-semibold text-gray-900">GoalTracker</h1>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="sm">
//                 <Search className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm">
//                 <Bell className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm" onClick={() => setIsProfileModalOpen(true)}>
//                 <Settings className="h-4 w-4" />
//               </Button>
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm font-medium">
//                   {user.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(" ")[0]}! 👋</h2>
//           <p className="text-gray-600">You&apos;re making great progress on your goals. Keep it up!</p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-blue-100">Active Goals</p>
//                   <p className="text-3xl font-bold">{activeGoals.length}</p>
//                 </div>
//                 <Target className="h-8 w-8 text-blue-200" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-green-100">Completed</p>
//                   <p className="text-3xl font-bold">{completedGoals.length}</p>
//                 </div>
//                 <TrendingUp className="h-8 w-8 text-green-200" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-purple-100">Groups</p>
//                   <p className="text-3xl font-bold">{groups.length}</p>
//                 </div>
//                 <Users className="h-8 w-8 text-purple-200" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-orange-100">Avg Progress</p>
//                   <p className="text-3xl font-bold">{Math.round(totalProgress)}%</p>
//                 </div>
//                 <Calendar className="h-8 w-8 text-orange-200" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <QuickActions onCreateGoal={() => setIsGoalModalOpen(true)} onJoinGroup={() => setIsGroupModalOpen(true)} />

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <GoalChart goals={goals} />
//           <CategoryChart goals={goals} categoryColors={categoryColors} />
//         </div>

//         {/* Goals Section */}
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-2xl font-bold text-gray-900">Your Goals</h3>
//             <Button onClick={() => setIsGoalModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="h-4 w-4 mr-2" />
//               New Goal
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {goals.map((goal) => (
//               <Card
//                 key={goal.id}
//                 className="hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => setSelectedGoal(goal)}
//               >
//                 <CardHeader className="pb-3">
//                   <div className="flex items-center justify-between">
//                     <Badge className={`${categoryColors[goal.category as keyof typeof categoryColors]} text-white`}>
//                       {goal.category}
//                     </Badge>
//                     <Badge variant={goal.status === "completed" ? "default" : "secondary"}>{goal.status}</Badge>
//                   </div>
//                   <CardTitle className="text-lg">{goal.title}</CardTitle>
//                   <CardDescription>{goal.description}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span>Progress</span>
//                       <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
//                     </div>
//                     <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
//                     <div className="flex justify-between text-sm text-gray-600">
//                       <span>${goal.currentAmount.toLocaleString()}</span>
//                       <span>${goal.targetAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <span>{goal.isPersonal ? "Personal" : "Group Goal"}</span>
//                       <span>Due: {goal.targetDate.toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <GoalModal
//         isOpen={isGoalModalOpen}
//         onClose={() => setIsGoalModalOpen(false)}
//         onSubmit={handleCreateGoal}
//         groups={groups}
//         goal={selectedGoal}
//         onUpdate={handleUpdateGoal}
//       />

//       <GroupModal
//         isOpen={isGroupModalOpen}
//         onClose={() => setIsGroupModalOpen(false)}
//         onSubmit={(groupData) => {
//           const newGroup: Group = {
//             id: Date.now().toString(),
//             name: groupData.name!,
//             description: groupData.description!,
//             members: [user.id],
//             color: groupData.color!,
//             createdAt: new Date(),
//           }
//           setGroups([...groups, newGroup])
//           setIsGroupModalOpen(false)
//         }}
//       />

//       <ProfileModal
//         isOpen={isProfileModalOpen}
//         onClose={() => setIsProfileModalOpen(false)}
//         user={user}
//         onUpdate={(userData) => {
//           setUser({ ...user, ...userData })
//           setIsProfileModalOpen(false)
//         }}
//       />
//     </div>
//   )
// }
