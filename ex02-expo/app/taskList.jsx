import { addTask, deleteTask, getTasks, updateTask } from "@/api";
import { CardTask } from "@/components/CardTask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text, TextInput, Card } from "react-native-paper";


export default function TaskList() {
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const { data, isFetching, error, isPending } = useQuery({
    queryKey: ["todos"],
    queryFn: getTasks,
  });

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setDescription("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isFetching) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  if (!data) {
    return <Text>No data available</Text>;
  }
  return (
    <View>
      <Text style={{ fonteSize: 24, fontWeight: "bold" }}>Task List</Text>
      <View style={{ flexDirection: "row" }}>
         <TextInput
          onChangeText={setDescription}
          value={description}
          placeholder="Add a task"
          textColor="#000000ff"
          activeOutlineColor="#000000"
        />
        <Button
          onPress={() => addMutation.mutate({ description })}
          rippleColor="#152084ff"
          mode="contained-tonal"
          buttonColor="#841584" 
          textColor="#ffffff"
        > 
          Add
        </Button>
      </View>
      <View
        style={{
          marginVertical: 5,
          backgroundColor: "grey",
          width: "90%",
          height: 2,
          alignSelf: "center",
        }}
      />
      <FlatList
        data={data.results}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item: task }) => (
          <CardTask
            key={task.objectId}
            task={task}
            onDelete={deleteMutation.mutate}
            onCheck={updateMutation.mutate}
          />
        )}
      />
      {isPending && <Text>Pending...</Text>}
    </View>
  );
}
