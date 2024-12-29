import { PUZZLE } from "@/constants/puzzle";
import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

export default function useLayoutSize(): {
    layoutSize: LayoutSize,
    handleLayout: (event: LayoutChangeEvent) => void
} {
    const [layoutSize, setLayoutSize] = useState<LayoutSize>({
        height: 0,
        width: 0
    })
    const handleLayout = (event: LayoutChangeEvent) => {
        const { height, width } = event.nativeEvent.layout;
        setLayoutSize({ 
            height: height - 2 * PUZZLE.screenPadding, 
            width: width - 2 * PUZZLE.screenPadding
        });
    };

    return { layoutSize, handleLayout };
}