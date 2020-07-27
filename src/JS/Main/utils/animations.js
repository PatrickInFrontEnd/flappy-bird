import gsap from "gsap";

const d = document;
const tl = gsap.timeline();

function headerAnimation() {
    const headerLogo = d.querySelector(".header__logo");
    const headerBg = d.querySelector(".header__bg");
    const headerP = d.querySelector(".header__p");

    tl.to(headerBg, { translateX: 0, duration: 1 })
        .to(headerBg, {
            height: "100%",
        })
        .to(headerP, { opacity: 1, duration: 0.8 })
        .to(headerBg, { translateY: "0px", duration: 0.8 })
        .fromTo(
            headerLogo,
            { translateY: "50px" },
            { opacity: 1, translateY: 0, duration: 1 }
        );
}

export const handleErrorAnimation = (freshAnimation = false) => {
    const errorWidthElement = d.querySelector("#widthError") || undefined;

    const errorWidthExists = !!errorWidthElement;

    if (errorWidthExists && !freshAnimation) {
        tl.fromTo(
            errorWidthElement,
            {
                opacity: 0,
                transform: "translateX(-100px)",
            },
            {
                opacity: 1,
                transform: "translateX(0)",
            }
        );
    } else {
        const tl = gsap.timeline();
        tl.fromTo(
            errorWidthElement,
            {
                opacity: 0,
                transform: "translateX(-100px)",
            },
            {
                opacity: 1,
                transform: "translateX(0)",
            }
        );
    }
};

export default headerAnimation;
