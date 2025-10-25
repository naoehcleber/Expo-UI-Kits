import { addTask, deleteTask, getTasks, updateTask } from "@/api";
import { CardTask } from "@/components/CardTask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text, TextInput, Card, Divider } from "react-native-paper";


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
      
      
      <Text >Lista de Tarefas</Text>
      
      <View >
        <TextInput
          
          mode="outlined" 
          onChangeText={setDescription}
          value={description}
          placeholder="Adicionar nova tarefa..."
          textColor="#000000"
          activeOutlineColor="#841584" 
        />
        <Button
         
          onPress={addMutation}
          rippleColor="#152084ff"
          mode="contained" // Mudança para 'contained' para mais destaque
          buttonColor="#841584" 
          textColor="#ffffff"
          loading={isPending} // Exibe loading no botão durante a adição
          disabled={!description.trim() || isPending}
        > 
          Adicionar
        </Button>
      </View>
      
      
      <Divider />
      
      {isPending && <ActivityIndicator animating={true} color="#841584" style={{ marginVertical: 10 }} />}
      {data.length === 0 && !isPending && (
          <Text >Nenhuma tarefa encontrada.</Text>
      )}

      {/* LISTA DE CARDS */}
      <FlatList
        data={data.results}
        keyExtractor={(item) => item.objectId}
        contentContainerStyle={{ paddingBottom: 20 }}
        
        renderItem={({ item: task }) => (

          <Card 
            key={task.objectId}
            
            elevation={2}
          >
            <Card.Title 
              
              title={task.description || "Tarefa sem descrição"} 
              subtitle={`ID: ${task.objectId}`}
              titleStyle={{ textDecorationLine: task.isCompleted ? 'line-through' : 'none' }}

              left={(props) => (
                  <Button 
                      {...props} 
                      mode="text"
                      icon={task.isCompleted ? "check-circle" : "circle-outline"}
                     
                      onPress={() => updateMutation.mutate({
                          objectId: task.objectId, 
                          isCompleted: !task.isCompleted // Inverte o estado
                      })}
                      
                      textColor={task.isCompleted ? "#4CAF50" : "#9E9E9E"}
                  />
              )}
              
              right={(props) => (
                  <Button 
                      {...props} 
                      icon="delete"
                      mode="text"
                      
                      onPress={() => deleteMutation.mutate(task.objectId)} 
                      textColor="#E57373" 
                  />
              )}
            />
          </Card>
        )}
      />
    </View>
  );
}
