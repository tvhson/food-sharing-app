import {StyleSheet, Text, View} from 'react-native';

import {Checkbox} from 'react-native-paper';
import Colors from '../../../global/Color';
import {IGetGroupTodoResponse} from '../../../api/GroupApi';
import React from 'react';
import {getFontFamily} from '../../../utils/fonts';
import {scale} from '../../../utils/scale';

const GroupTodoItem = ({
  todo,
  handleFinishTodo,
  isAuthor,
  index,
}: {
  todo: IGetGroupTodoResponse;
  handleFinishTodo: (todoId: number) => void;
  isAuthor: boolean;
  index: number;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'white',
        padding: 10,
      }}>
      <View style={{flex: 1}}>
        <Text style={[styles.text, {paddingTop: scale(8)}]}>
          {new Date(todo.date).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      <View style={{flex: 2, paddingTop: scale(8)}}>
        <Text
          style={[
            styles.text,
            {
              textDecorationLine:
                todo.status === 'completed' ? 'line-through' : 'none',
              color:
                todo.status === 'pending' && new Date(todo.date) < new Date()
                  ? Colors.red
                  : 'black',
            },
          ]}>
          {todo.title}
        </Text>
      </View>
      {isAuthor && (
        <View style={{flex: 0.5}}>
          <Checkbox
            status={todo.status === 'completed' ? 'checked' : 'unchecked'}
            onPress={() => handleFinishTodo(todo.id)}
            color={Colors.greenPrimary}
          />
        </View>
      )}
    </View>
  );
};

export default GroupTodoItem;

const styles = StyleSheet.create({
  text: {
    fontSize: scale(14),
    fontFamily: getFontFamily('regular'),
    color: 'black',
  },
});
