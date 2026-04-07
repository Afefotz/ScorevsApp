import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const ScreenWrapper = ({ children, style }: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.safeArea,
            {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right
            },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    }
});