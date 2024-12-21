import {TextInputProps, TouchableOpacityProps} from "react-native";

declare interface Report {
    id: number;
    title: string;
    category: string;
    description: string;
    location: string;
    neighborhood: number;
    longitude: number;
    status: string;
    severity_score: number;
    votes: number;
    created_at: string;
    reporter: {
        id: number;
        full_name: string;
        avatar_url: string;
        rating: number;
        citizen_score: number;
    };
    image: string;
}

declare interface SeverityRating {
    rating: number;
}

declare interface CategoryOption {
    id: string;
    title: string;
    image: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "outline-color" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}