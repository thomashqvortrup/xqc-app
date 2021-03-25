import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, FlatList, View, Image, Platform } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList, State } from "../../utils/types";
import { RouteProp } from "@react-navigation/native";
import {
  Header,
  Button,
  IconButton,
  ImageOverlay,
  ImageContainer,
} from "../../components/molecules/index";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "../../containers/index";
import {
  initModelAsync,
  negativeExamplePressed,
  positiveExamplePressed,
  learnModelAsync,
  randomSetAsync,
  resetModelAsync,
} from "../../redux/reducers";
import { colors } from "../../utils/theme";
import { customAlert } from "../../utils/helpers";
import { Menu, Search } from "../../components/organisms/index";
import { Obj, Model } from "../../utils/types";
import { saveModelInAsyncStorage } from "../../utils/storage";
import { setSeen } from "../../redux/actions";
import { calculateColumnAmount, calculateImageWidth } from "../../utils/layout";

type HomeProps = StackNavigationProp<HomeStackParamList, "Home">;
type RouteProps = RouteProp<HomeStackParamList, "Home">;

type Props = {
  navigation: HomeProps;
  route: RouteProps;
};

export default function Home({ navigation, route }: Props) {
  const { loadModel } = route.params;

  const [state, setState] = useState({
    loadingTitle: "Initiating the model..",
    menu: false,
    search: false,
  });
  const [selected, setSelected] = useState<Obj[]>([]);
  const dispatch = useDispatch();
  const redux = useSelector((state: State) => state);

  useEffect(() => {
    if (loadModel === undefined) {
      dispatch(initModelAsync());
    }
    const unsubscribe = navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [navigation]);

  const quickSaveModel = async () => {
    const model: Model = {
      mode: "standard",
      name: loadModel?.name!,
      negatives: redux.negatives,
      positives: redux.positives,
      seen: redux.seen,
      lastSeen: redux.images,
      created: new Date(loadModel?.created!),
    };

    await saveModelInAsyncStorage(model);
    customAlert("success", "Your model has been saved!");
  };

  return (
    <Container loading={redux.loading} loadingTitle={state.loadingTitle}>
      <Header
        title="XQC"
        onPress={() => {
          dispatch(setSeen([]));
          navigation.goBack();
        }}
        menu
        search
      />
      {redux.search && (
        <Search onClose={() => setState({ ...state, search: false })} />
      )}

      {redux.menu && (
        <Menu
          onClickReset={() => {
            dispatch(resetModelAsync());
            setState({ ...state, menu: false });
          }}
          onClickSaveModel={() => {
            setState({ ...state, menu: false });
            navigation.navigate("ModelName", { mode: "standard" });
          }}
          canQuickSave={loadModel !== undefined}
          onClickQuickSave={() => {
            quickSaveModel();
          }}
          onClose={() => setState({ ...state, menu: false })}
        />
      )}

      {redux.images.length > 0 && (
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-between" }}
          data={redux.images}
          style={{ paddingBottom: 80 }}
          numColumns={calculateColumnAmount()}
          keyExtractor={(item) => item.exqId.toString()}
          renderItem={({ item, index }) => {
            return (
              <View
                style={[
                  styles.box,
                  selected.includes(item)
                    ? { backgroundColor: colors.gray }
                    : {},
                ]}
              >
                {/* //@ts-ignore */}
                <Image
                  style={{
                    width: "100%",
                    height: 200,
                    resizeMode: "stretch",
                    borderRadius: 12,
                  }}
                  source={{
                    uri: item.imageURI,
                  }}
                />
                <ImageOverlay
                  onPressNegative={() => {
                    dispatch(negativeExamplePressed(item));
                  }}
                  onPressPositive={() => {
                    dispatch(positiveExamplePressed(item));
                  }}
                  negativeSelected={redux.negatives.includes(item)}
                  positiveSelected={redux.positives.includes(item)}
                />
              </View>
            );
          }}
        />
      )}

      <View style={styles.buttons}>
        <IconButton
          title="+/-"
          onPress={() => {
            navigation.navigate("PosAndNeg");
          }}
          secondary
        />
        <IconButton
          title="NEW RANDOM SET"
          onPress={() => dispatch(randomSetAsync())}
          type="random"
          style={{ marginLeft: 10, marginRight: 10 }}
          secondary
        />
        <IconButton
          title="TRAIN"
          onPress={() => dispatch(learnModelAsync())}
          type="sync"
        />
      </View>
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
  buttons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
