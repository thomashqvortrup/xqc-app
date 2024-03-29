import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Platform } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList, Model, State } from "../../utils/types";
import { Text } from "../../components/atoms/index";
import { Header, Button } from "../../components/molecules/index";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "../../containers/index";
import {} from "../../redux/reducers";
import { colors, fonts } from "../../utils/theme";
import { saveModelInAsyncStorage, checkName } from "../../utils/storage";
import { customAlert } from "../../utils/helpers";
import { RouteProp } from "@react-navigation/native";

type ModelNameProps = StackNavigationProp<HomeStackParamList, "ModelName">;
type RouteProps = RouteProp<HomeStackParamList, "ModelName">;

type Props = {
  navigation: ModelNameProps;
  route: RouteProps;
};

export default function ChooseMode({ navigation, route }: Props) {
  const [state, setState] = useState({ loading: false, name: "" });
  const dispatch = useDispatch();
  const redux = useSelector((state: State) => state);
  const { mode } = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [navigation]);

  const webStyles = {
    outlineWidth: 0,
  };

  const save = async () => {
    if (state.name.length === 0) {
      customAlert("error", "Your must have a name!");
      return;
    }
    if (await checkName(state.name)) {
      customAlert("error", "This name already exists!");
      setState({ ...state, name: "" });
      return;
    }

    const model: Model = {
      mode: redux.mode,
      name: state.name,
      negatives: redux.negatives,
      positives: redux.positives,
      seen: redux.seen,
      lastSeen: redux.images,
      filter: redux.selectedFilter,
      created: new Date(),
    };

    console.log("MODEL");
    console.log(model);

    await saveModelInAsyncStorage(model);
    customAlert("success", "Your model has been saved!");
    navigation.goBack();
  };

  return (
    <Container>
      <Header
        title="Enter a name for your model"
        onPress={() => navigation.goBack()}
      />
      <View style={{ marginVertical: 30 }}>
        <TextInput
          autoFocus
          value={state.name}
          onChangeText={(e) => setState({ ...state, name: e })}
          placeholder="Name"
          style={[
            styles.input,
            Platform.OS === "web" ? (webStyles as any) : ({} as any),
          ]}
        ></TextInput>
      </View>
      <View style={{ alignItems: "center" }}>
        <Button title="SAVE" onPress={() => save()} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.med,
    textAlign: "center",
  },
});
