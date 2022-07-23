import React, { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { IFood } from '../../types/food';

const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState({} as IFood);
  const [newFoodModalIsOpen, setNewFoodModalIsOpen] = useState(false);
  const [editFoodModalIsOpen, setEditFoodModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      const { data: Foods } = await api.get<IFood[]>('/foods');
      setFoods(Foods);
    };

    fetchFoods();
  }, []);

  const handleAddFood = async (food: IFood) => {
    try {
      const { data: newFood } = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods((prevFoods) => [...prevFoods, newFood]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: IFood) => {
    const previousFoods = [...foods];

    try {
      const { data: updatedFood } = await api.put<IFood>(
        `/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food,
        }
      );

      const updatedFoods = previousFoods.map((food) =>
        food.id !== updatedFood.id ? food : updatedFood
      );

      setFoods(updatedFoods);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setEditFoodModalIsOpen(true);
  };

  const handleDeleteFood = async (id: number) => {
    const previousFoods = [...foods];

    try {
      await api.delete(`/foods/${id}`);

      const updatedFoods = previousFoods.filter((food) => food.id !== id);

      setFoods(updatedFoods);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleModal = () => setNewFoodModalIsOpen((isOpen) => !isOpen);

  const toggleEditModal = () => setEditFoodModalIsOpen((isOpen) => !isOpen);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={newFoodModalIsOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editFoodModalIsOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
