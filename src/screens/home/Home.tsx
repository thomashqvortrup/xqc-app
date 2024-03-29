import React, { useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList, State } from "../../utils/types";
import { RouteProp } from "@react-navigation/native";
import { Header, ImageOverlay } from "../../components/molecules/index";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "../../containers/index";
import {
  initModelAsync,
  negativeExamplePressed,
  positiveExamplePressed,
  reset,
} from "../../redux/reducers";
import { ButtonBar, ImageRenderer } from "../../components/organisms/index";
import { setSearchData, setSeen, setSelectedFilter } from "../../redux/actions";
import { calculateColumnAmount, calculateImageWidth } from "../../utils/layout";
import { Text } from "../../components/atoms";

type HomeProps = StackNavigationProp<HomeStackParamList, "Home">;
type RouteProps = RouteProp<HomeStackParamList, "Home">;

type Props = {
  navigation: HomeProps;
  route: RouteProps;
};

export default function Home({ navigation, route }: Props) {
  const { loadModel } = route.params;
  const dispatch = useDispatch();
  const redux = useSelector((state: State) => state);

  useEffect(() => {
    if (loadModel === undefined) {
      dispatch(initModelAsync());
    }
    const unsubscribe = navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [navigation]);

  return (
    <Container model={loadModel} navigation={navigation}>
      <Header
        title={Platform.OS === "web" ? "PROJECTION" : ""}
        onPress={() => {
          dispatch(reset());
          navigation.goBack();
        }}
        hideBack
        menu
        filter
        onPressFilter={() => navigation.navigate("Filter")}
        search
        onPressSearch={() => {
          dispatch(setSearchData(redux.terms));
          navigation.navigate("Search", { mode: "terms" });
        }}
      />
      <ScrollView>
        {redux.images.length > 0 && (
          <ImageRenderer navigation={navigation} data={redux.images} />
        )}
      </ScrollView>

      {redux.images.length === 0 && !redux.loading && (
        <Text.Regular style={{ alignSelf: "center" }}>
          No results - maybe your filter is too strict
        </Text.Regular>
      )}
      <ButtonBar navigation={navigation} posAndNeg randomSet train />
    </Container>
  );
}

const styles = StyleSheet.create({
  box: {
    width: calculateImageWidth(),
    backgroundColor: "#393939",
    marginTop: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
});
