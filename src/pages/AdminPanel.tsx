import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [tweets, setTweets] = useState<any[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'ozansurel@gmail.com') {
        setIsAdmin(true);
        fetchAllData();
      }
    };

    checkAdminStatus();
  }, []);

  const fetchAllData = async () => {
    // Fetch users and their profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');
    setUsers(profiles || []);

    // Fetch generated images
    const { data: generatedImages } = await supabase
      .from('generated_images')
      .select('*');
    setImages(generatedImages || []);

    // Fetch scheduled tweets
    const { data: scheduledTweets } = await supabase
      .from('scheduled_tweets')
      .select('*');
    setTweets(scheduledTweets || []);

    // Fetch diet plans
    const { data: diets } = await supabase
      .from('diet_plans')
      .select('*');
    setDietPlans(diets || []);

    // Fetch workout plans
    const { data: workouts } = await supabase
      .from('workout_plans')
      .select('*');
    setWorkoutPlans(workouts || []);
  };

  if (!isAdmin) {
    return <div className="p-8">Unauthorized access</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="tweets">Tweets</TabsTrigger>
          <TabsTrigger value="diet">Diet Plans</TabsTrigger>
          <TabsTrigger value="workout">Workout Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>All registered users and their profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                {users.map((user) => (
                  <div key={user.id} className="mb-4 p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">ID: {user.id}</p>
                        <p>Credits: {user.credits}</p>
                        <p>Status: <Badge>{user.subscription_status}</Badge></p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Generated Images</CardTitle>
              <CardDescription>All AI-generated images</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="border rounded p-2">
                      <img src={image.url} alt={image.prompt} className="w-full h-48 object-cover rounded" />
                      <p className="mt-2 text-sm truncate">{image.prompt}</p>
                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>Model: {image.model_id}</span>
                        <Badge variant={image.is_nsfw ? "destructive" : "secondary"}>
                          {image.is_nsfw ? "NSFW" : "Safe"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tweets">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Tweets</CardTitle>
              <CardDescription>All scheduled and posted tweets</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                {tweets.map((tweet) => (
                  <div key={tweet.id} className="mb-4 p-4 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{tweet.content}</p>
                        <p className="text-sm text-gray-500">Category: {tweet.category}</p>
                      </div>
                      <Badge variant={tweet.status === 'pending' ? "secondary" : "success"}>
                        {tweet.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Scheduled for: {new Date(tweet.scheduled_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diet">
          <Card>
            <CardHeader>
              <CardTitle>Diet Plans</CardTitle>
              <CardDescription>All generated diet plans</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                {dietPlans.map((plan) => (
                  <div key={plan.id} className="mb-4 p-4 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Age: {plan.age} | Gender: {plan.gender}</p>
                        <p className="text-sm">Height: {plan.height}cm | Weight: {plan.weight}kg</p>
                        <p className="text-sm">Activity Level: {plan.activity_level}</p>
                        <div className="mt-2">
                          <p className="font-medium">Restrictions:</p>
                          <div className="flex gap-2 flex-wrap">
                            {plan.dietary_restrictions.map((restriction: string) => (
                              <Badge key={restriction} variant="outline">{restriction}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout">
          <Card>
            <CardHeader>
              <CardTitle>Workout Plans</CardTitle>
              <CardDescription>All generated workout plans</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                {workoutPlans.map((plan) => (
                  <div key={plan.id} className="mb-4 p-4 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Goal: {plan.fitness_goal}</p>
                        <p className="text-sm">Level: {plan.fitness_level}</p>
                        <p className="text-sm">Duration: {plan.workout_duration} minutes</p>
                        <div className="mt-2">
                          <p className="font-medium">Equipment:</p>
                          <div className="flex gap-2 flex-wrap">
                            {plan.equipment.map((item: string) => (
                              <Badge key={item} variant="outline">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;