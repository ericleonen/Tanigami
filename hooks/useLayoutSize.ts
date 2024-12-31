import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

export default function useLayoutSize(padding: number): {
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
            height: height - 2 * padding, 
            width: width - 2 * padding
        });
    };

    return { layoutSize, handleLayout };
}