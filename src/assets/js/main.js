gsap.registerPlugin(Draggable);

const menuDropZone = document.querySelector(".menu-drop-zone");
const menuDrawer = document.querySelector(".menu-drawer");
const menuLogo = document.querySelector(".menu-logo");
const menuLogoImage = document.querySelector(".menu-logo img");
const logoOrbit = document.querySelector(".logo-orbit");
const menuItems = document.querySelector(".menu-items");
const menuItemElements = document.querySelectorAll(".menu-item");
const menuToggler = document.querySelector(".menu-toggler");
const drawerGlow = document.querySelector(".drawer-glow");
const togglerRing = document.querySelector(".toggler-ring");
const dragLabel = document.querySelector(".drag-label");

let isMenuOpen = false;
let isDragging = false;
let pointerMoved = false;

let previousX = 0;
let previousY = 0;

let velocityX = 0;
let velocityY = 0;

const drawerGap = 5.6;
const drawerPadding = 5.6;

const logoWidth = menuLogo.offsetWidth;
const togglerWidth = menuToggler.offsetWidth;

/* -------------------------------- */
/* INITIAL STATE */
/* -------------------------------- */

gsap.set(menuItems, {
    width: 0,
});

gsap.set(menuItemElements, {
    opacity: 0,
    scale: 0.7,
    y: 10,
    rotationX: 12,
});

const menuItemsFullWidth = menuItems.scrollWidth;

const closedMenuWidth =
    drawerPadding + logoWidth + drawerGap + togglerWidth + drawerPadding;

gsap.set(menuDropZone, {
    width: closedMenuWidth,
});

/* -------------------------------- */
/* INTRO */
/* -------------------------------- */

gsap.from(menuDrawer, {
    scale: 0.75,
    opacity: 0,
    rotation: -8,
    duration: 1,
    ease: "elastic.out(1, 0.65)",
});

gsap.from(menuLogoImage, {
    scale: 0,
    rotation: -180,
    duration: 1.2,
    delay: 0.15,
    ease: "back.out(2)",
});

gsap.to(logoOrbit, {
    rotation: 360,
    duration: 12,
    repeat: -1,
    ease: "none",
});

gsap.to(menuLogoImage, {
    y: -1.5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
});

/* -------------------------------- */
/* MENU TOGGLE */
/* -------------------------------- */

menuToggler.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    /*
     * If the pointer actually dragged the drawer,
     * this click should not toggle the menu.
     */
    if (pointerMoved) {
        pointerMoved = false;
        return;
    }

    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

/* -------------------------------- */
/* OPEN MENU */
/* -------------------------------- */

function openMenu() {
    isMenuOpen = true;

    menuToggler.classList.add("close");

    gsap.killTweensOf(menuItems);
    gsap.killTweensOf(menuItemElements);

    gsap.to(menuItems, {
        width: menuItemsFullWidth,
        duration: 0.7,
        ease: "expo.out",
    });

    gsap.to(menuItemElements, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        duration: 0.65,
        stagger: 0.07,
        delay: 0.15,
        ease: "back.out(1.7)",
    });

    gsap.fromTo(
        menuItemElements,
        {
            x: -20,
        },
        {
            x: 0,
            duration: 0.6,
            stagger: 0.07,
            delay: 0.15,
            ease: "expo.out",
        },
    );

    gsap.to(menuLogoImage, {
        rotation: 360,
        scale: 1.08,
        duration: 0.7,
        ease: "back.out(2)",
    });

    gsap.to(togglerRing, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(2)",
    });

    gsap.to(menuDrawer, {
        boxShadow:
            "0 35px 100px rgba(0,0,0,.4), 0 10px 35px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.9)",
        duration: 0.5,
    });
}

/* -------------------------------- */
/* CLOSE MENU */
/* -------------------------------- */

function closeMenu() {
    isMenuOpen = false;

    menuToggler.classList.remove("close");

    gsap.killTweensOf(menuItems);
    gsap.killTweensOf(menuItemElements);

    gsap.to(menuItemElements, {
        opacity: 0,
        scale: 0.7,
        y: 8,
        rotationX: 12,
        duration: 0.3,
        stagger: {
            each: 0.04,
            from: "end",
        },
        ease: "power3.in",
    });

    gsap.to(menuItems, {
        width: 0,
        duration: 0.55,
        delay: 0.08,
        ease: "expo.inOut",
    });

    gsap.to(menuLogoImage, {
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
    });

    gsap.to(togglerRing, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
    });

    gsap.to(menuDrawer, {
        boxShadow:
            "0 25px 70px rgba(0,0,0,.35), 0 5px 20px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.9)",
        duration: 0.5,
    });
}

/* -------------------------------- */
/* DROP ZONE */
/* -------------------------------- */

let isNearHome = false;

function showDropZone() {
    if (isNearHome) return;

    isNearHome = true;

    gsap.to(menuDropZone, {
        opacity: 1,
        scale: 1.02,
        duration: 0.25,
        ease: "power2.out",
    });

    gsap.to(menuDropZone, {
        boxShadow:
            "0 0 0 1px rgba(140,255,79,.2), 0 0 40px rgba(140,255,79,.12)",
        duration: 0.25,
    });
}

function hideDropZone() {
    if (!isNearHome) return;

    isNearHome = false;

    gsap.to(menuDropZone, {
        opacity: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
    });
}

/* -------------------------------- */
/* DRAG LABEL */
/* -------------------------------- */

function showDragLabel() {
    gsap.to(dragLabel, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
    });
}

function hideDragLabel() {
    gsap.to(dragLabel, {
        opacity: 0,
        y: 5,
        duration: 0.2,
    });
}

/* -------------------------------- */
/* DRAGGABLE */
/* -------------------------------- */

const draggable = Draggable.create(menuDrawer, {
    type: "x,y",

    bounds: {
        minX: 16,
        minY: 16,
        maxX: window.innerWidth - menuDrawer.offsetWidth - 16,
        maxY: window.innerHeight - menuDrawer.offsetHeight - 16,
    },

    edgeResistance: 0.82,

    cursor: "grab",
    activeCursor: "grabbing",

    onPress() {
        pointerMoved = false;
        isDragging = false;

        previousX = this.x;
        previousY = this.y;

        velocityX = 0;
        velocityY = 0;

        gsap.to(menuDrawer, {
            scale: 1.025,
            duration: 0.25,
            ease: "power2.out",
        });

        gsap.to(drawerGlow, {
            opacity: 1,
            duration: 0.2,
        });
    },

    onDrag() {
        /*
         * Draggable only calls onDrag when
         * actual movement happens.
         */
        pointerMoved = true;
        isDragging = true;

        velocityX = this.x - previousX;
        velocityY = this.y - previousY;

        previousX = this.x;
        previousY = this.y;

        /* -------------------------------- */
        /* HOME DISTANCE */
        /* -------------------------------- */

        const distance = Math.sqrt(this.x * this.x + this.y * this.y);

        if (distance < 180) {
            showDropZone();
        } else {
            hideDropZone();
        }

        /* -------------------------------- */
        /* 3D TILT */
        /* -------------------------------- */

        const rotateY = gsap.utils.clamp(-12, 12, velocityX * 1.5);

        const rotateX = gsap.utils.clamp(-10, 10, -velocityY * 1.2);

        gsap.to(menuDrawer, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.18,
            overwrite: true,
            ease: "power2.out",
        });

        /* -------------------------------- */
        /* LOGO */
        /* -------------------------------- */

        gsap.to(menuLogoImage, {
            rotation: gsap.utils.clamp(-20, 20, velocityX * 2),
            duration: 0.2,
            overwrite: true,
        });

        /* -------------------------------- */
        /* ORBIT */
        /* -------------------------------- */

        gsap.to(logoOrbit, {
            rotation: velocityX * 8,
            duration: 0.25,
            overwrite: true,
        });
    },

    onRelease() {
        hideDragLabel();

        gsap.to(menuDrawer, {
            scale: 1,
            duration: 0.45,
            ease: "elastic.out(1, 0.7)",
        });

        gsap.to(drawerGlow, {
            opacity: 0,
            duration: 0.35,
        });
    },

    onDragEnd() {
        const distance = Math.sqrt(this.x * this.x + this.y * this.y);

        if (distance < 200) {
            snapHome();
        }

        gsap.to(menuDrawer, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.65,
            ease: "elastic.out(1, 0.6)",
        });

        gsap.to(menuLogoImage, {
            rotation: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
        });

        hideDropZone();

        setTimeout(() => {
            isDragging = false;
        }, 50);
    },
})[0];

/* -------------------------------- */
/* SNAP HOME */
/* -------------------------------- */

function snapHome() {
    gsap.to(menuDrawer, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.55)",
    });

    gsap.fromTo(
        menuDropZone,
        {
            scale: 1,
            opacity: 1,
        },
        {
            scale: 1.35,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
        },
    );

    gsap.fromTo(
        menuLogoImage,
        {
            scale: 1.2,
        },
        {
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.6)",
        },
    );
}

/* -------------------------------- */
/* MENU ITEM MAGNETISM */
/* -------------------------------- */

menuItemElements.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
        if (isDragging) return;

        const rect = item.getBoundingClientRect();

        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;

        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

        gsap.to(item, {
            x: x * 5,
            y: y * 3,
            duration: 0.25,
            ease: "power2.out",
        });
    });

    item.addEventListener("mouseleave", () => {
        gsap.to(item, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
        });
    });
});

/* -------------------------------- */
/* TOGGLER HOVER */
/* -------------------------------- */

menuToggler.addEventListener("mouseenter", () => {
    if (isDragging) return;

    gsap.to(menuToggler, {
        scale: 1.08,
        duration: 0.35,
        ease: "back.out(2)",
    });

    gsap.to(togglerRing, {
        scale: 1,
        opacity: 0.7,
        duration: 0.35,
    });
});

menuToggler.addEventListener("mouseleave", () => {
    gsap.to(menuToggler, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
    });

    if (!isMenuOpen) {
        gsap.to(togglerRing, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
        });
    }
});

/* -------------------------------- */
/* RESIZE */
/* -------------------------------- */

window.addEventListener("resize", () => {
    draggable.applyBounds({
        minX: 16,
        minY: 16,
        maxX: window.innerWidth - menuDrawer.offsetWidth - 16,
        maxY: window.innerHeight - menuDrawer.offsetHeight - 16,
    });
});
