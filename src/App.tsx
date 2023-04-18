import React, {useCallback, useMemo, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Agenda,
  AgendaEntry,
  AgendaSchedule,
  DateData,
} from 'react-native-calendars';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [items, setItems] = useState<AgendaSchedule>({});

  const backgroundStyle = 'bg-neutral-300 dark:bg-slate-900';

  const timeToString = useCallback((time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }, []);

  const loadItems = useCallback(
    (day: DateData) => {
      const _items = items || {};

      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          const time = day.timestamp + i * 24 * 60 * 60 * 1000;
          const strTime = timeToString(time);

          if (!_items[strTime]) {
            _items[strTime] = [];

            const numItems = Math.floor(Math.random() * 3 + 1);
            for (let j = 0; j < numItems; j++) {
              _items[strTime].push({
                name: 'Item for ' + strTime + ' #' + j,
                height: Math.max(50, Math.floor(Math.random() * 150)),
                day: strTime,
              });
            }
          }
        }

        const newItems: AgendaSchedule = {};
        Object.keys(_items).forEach(key => {
          newItems[key] = _items[key];
        });
        setItems(newItems);
      }, 1000);
    },
    [items, timeToString],
  );

  const handleItems = useCallback(
    (reservation: AgendaEntry, isFirst: boolean) => {
      const fontSize = isFirst ? 16 : 14;
      const color = isFirst ? 'black' : '#43515c';

      return (
        <TouchableOpacity
          testID="item"
          className="bg-white flex rounded p-2 mr-2 mt-4"
          style={{height: reservation.height}}
          onPress={() => Alert.alert(reservation.name)}>
          <Text style={{fontSize, color}}>{reservation.name}</Text>
        </TouchableOpacity>
      );
    },
    [],
  );

  const renderEmptyDate = useCallback(() => {
    return (
      <View className="h-4 flex pt-7">
        <Text>This is a empty date!</Text>
      </View>
    );
  }, []);

  const rowHasChanged = useCallback((r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  }, []);

  return (
    <SafeAreaView className={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View className="bg-white dark:bg-black flex h-full">
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          selected={'2023-04-18'}
          renderItem={handleItems}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={rowHasChanged}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
