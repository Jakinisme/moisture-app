import React from "react";
import { Link } from "react-router-dom";
import  useIntersectionObserver  from "../../../hooks/intersectionObserver";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
    to?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
    asLink?: boolean;
}

const Button = (props: ButtonProps) => {
    const {children, className, type, onClick, to, asLink} = props;
    
    const { ref, isIntersecting } = useIntersectionObserver<HTMLButtonElement>({
        threshold: 0.1,
        rootMargin: '20px'
    });
    
    const buttonStyle = {
        transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
        transform: 'translateY(0)'
    };

    const buttonClassName = `${className} animate-fade-in`;

    if (asLink && to) {
        return (
            <Link 
                to={to}
                className={buttonClassName}
                style={buttonStyle}
                onClick={onClick}
            >
                {children}
            </Link>
        );
    }

    const dynamicButtonStyle = {
        ...buttonStyle,
        transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)'
    };

    const dynamicButtonClassName = `${className} ${isIntersecting ? 'animate-fade-in' : 'opacity-0'}`;

    return (
        <button 
            ref={ref}
            className={dynamicButtonClassName}
            type={type}
            onClick={onClick}
            style={dynamicButtonStyle}
        >
            {children}
        </button>
    )
}

export default Button;