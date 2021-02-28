import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Animated, { or, Easing } from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
const { width } = Dimensions.get("window");

const { cond, eq, add, call, set, Value, event, timing } = Animated;

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.dragX = new Value(0);
    this.dragY = new Value(0);

    this.offsetX = new Value(width / 2);
    this.offsetY = new Value(200);

    this.gestureState = new Value(-1);


    this.dragBoxX = new Value(0);
    this.dragBoxY = new Value(0);

    this.boxGestureState = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: this.dragX,
          translationY: this.dragY,
          state: this.gestureState,
        },
      },
    ]);
    this.onBoxGestureEvent = event([
      {
        nativeEvent: {
          translationX: this.dragBoxX,
          translationY: this.dragBoxY,
          state: this.boxGestureState,
        },
      },
    ]);

    this.addY = add(this.offsetY, this.dragY);
    this.addX = add(this.offsetX, this.dragX);

    this.transX = cond(
      eq(this.gestureState, State.ACTIVE),
      this.addX,
      set(this.offsetX, this.addX)
    );

    this.transY = cond(eq(this.gestureState, State.ACTIVE), this.addY, [
      set(this.offsetY, this.addY),
    ]);

    // box reanimated declarations

    this.offsetBoxX = new Value(width / 2);
    this.offsetBoxY = new Value(100);

    
    this.addBoxX = add(this.offsetBoxX, this.dragBoxX);

    this.transBoxX = cond(
      eq(this.boxGestureState, State.ACTIVE),
      this.addBoxX,
      set(this.offsetBoxX, this.addBoxX)
    );






    // reanimated auto animations
    this.x_transition = new Value(0)
    this.config = {
      duration : 5000,
      toValue : 280, 
      easing : Easing.inOut(Easing.ease)
      
    }
    this.animate = timing(this.x_transition, this.config)

  }

  onDrop = ([x, y]) => {
    // alert(`You dropped at x: ${x} and y: ${y}!`);
  };
  onStart = ([x, y]) => {
    // alert(`You dropped at x: ${x} and y: ${y}!`);
    console.log("Starting!.....");
  };
  onBoxDrop = ([x, y]) => {
    // alert(`You dropped at x: ${x} and y: ${y}!`);
    // alert(`You dropped the box at x: ${x} and y: ${y}!`);
  };
  onBoxStart = ([x, y]) => {
    // alert(`You dropped at x: ${x} and y: ${y}!`);
    // alert(`You dropped the box at x: ${x} and y: ${y}!`);
    console.log("box starting")
  };


  componentDidMount(){
    this.animate.start()
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.Code>
          {() =>
            cond(
              or(
                eq(this.gestureState, State.END),
                eq(this.gestureState, State.CANCELLED)
              ),

              call([this.addX, this.addY], this.onDrop)
            )
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            cond(
              eq(this.gestureState, State.ACTIVE),
              call([this.addX, this.addY], this.onStart)
            )
          }
        </Animated.Code>




{/* box animated code */}


<Animated.Code>
          {() =>
            cond(
              eq(this.boxGestureState, State.ACTIVE),
              call([this.addBoxX], this.onBoxStart)
            )
          }
        </Animated.Code>
<Animated.Code>
          {() =>
            cond(
              or(
                eq(this.boxGestureState, State.END),
                eq(this.boxGestureState, State.CANCELLED)
              ),

              call([this.addBoxX], this.onBoxDrop)
            )
          }
        </Animated.Code>

        <PanGestureHandler
        maxPointers = {1}
        minDist = {10}
        onGestureEvent = {this.onBoxGestureEvent}
        onHandlerStateChange = {this.onBoxGestureEvent}
        
        >
        <Animated.View
          style={[
            styles.box,
            {
              top: new Value(100),
              transform: [
                {
                  translateX: this.x_transition,
                },
                // {
                //   translateY: this.transY,
                // },
              ],
            },
          ]}
        ></Animated.View>
        </PanGestureHandler>

  
        <PanGestureHandler
          maxPointers={1}
          minDist={10}
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <Animated.View
            style={[
              // styles.box,
              {
                transform: [
                  {
                    translateX: this.transX,
                  },
                  {
                    translateY: this.transY,
                  },
                ],
              },
            ]}
          >
            <Text>Mega</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const CIRCLE_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: "tomato",
    position: "absolute",
    marginLeft: -(CIRCLE_SIZE / 2),
    marginTop: -(CIRCLE_SIZE / 2),
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: "#000",
    left :100
  },
});
