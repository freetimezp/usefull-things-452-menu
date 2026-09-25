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

let menuItemsFullWidth = 0;
let menuItemsFullHeight = 0;

const drawerGap = 5.6;
const drawerPadding = 5.6;

/* -------------------------------- */
/* HELPERS */
/* -------------------------------- */

function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

function calculateMenuDimensions() {
    /*
     * scrollWidth works for desktop horizontal layout.
     * scrollHeight works for mobile vertical layout.
     */
    menuItemsFullWidth = menuItems.scrollWidth;
    menuItemsFullHeight = menuItems.scrollHeight;
}

function getDrawerBounds() {
    return {
        minX: 0,
        minY: 0,
        maxX: Math.max(0, window.innerWidth - menuDrawer.offsetWidth - 16),
        maxY: Math.max(0, window.innerHeight - menuDrawer.offsetHeight - 16),
    };
}

function updateDragBounds() {
    if (draggable) {
        draggable.applyBounds(getDrawerBounds());
    }
}

/* -------------------------------- */
/* INITIAL STATE */
/* -------------------------------- */

gsap.set(menuItems, {
    width: 0,
    height: "auto",
});

gsap.set(menuItemElements, {
    opacity: 0,
    scale: 0.7,
    y: 10,
    x: 0,
    rotationX: 12,
});

calculateMenuDimensions();

if (isMobile()) {
    gsap.set(menuItems, {
        width: "100%",
        height: 0,
    });
}

/* -------------------------------- */
/* CLOSED DRAWER WIDTH */
/* -------------------------------- */

const logoWidth = menuLogo.offsetWidth;
const togglerWidth = menuToggler.offsetWidth;

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

/* -------------------------------- */
/* LOGO ORBIT */
/* -------------------------------- */

gsap.to(logoOrbit, {
    rotation: 360,
    duration: 12,
    repeat: -1,
    ease: "none",
});

/* -------------------------------- */
/* LOGO FLOAT */
/* -------------------------------- */

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
     * Prevent click after dragging.
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

    calculateMenuDimensions();

    if (isMobile()) {
        /* -------------------------------- */
        /* MOBILE: VERTICAL */
        /* -------------------------------- */

        gsap.set(menuItems, {
            width: "100%",
        });

        gsap.to(menuItems, {
            height: menuItemsFullHeight,
            duration: 0.65,
            ease: "expo.out",
        });

        gsap.fromTo(
            menuItemElements,
            {
                opacity: 0,
                scale: 0.85,
                y: -15,
                x: 0,
                rotationX: 8,
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
                rotationX: 0,
                duration: 0.55,
                stagger: 0.07,
                delay: 0.08,
                ease: "back.out(1.5)",
            },
        );

        /*
         * Update bounds after the drawer expands.
         */
        gsap.delayedCall(0.1, () => {
            updateDragBounds();
        });
    } else {
        /* -------------------------------- */
        /* DESKTOP: HORIZONTAL */
        /* -------------------------------- */

        gsap.to(menuItems, {
            width: menuItemsFullWidth,
            duration: 0.7,
            ease: "expo.out",
        });

        gsap.fromTo(
            menuItemElements,
            {
                opacity: 0,
                scale: 0.7,
                y: 10,
                x: -20,
                rotationX: 12,
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
                rotationX: 0,
                duration: 0.65,
                stagger: 0.07,
                delay: 0.15,
                ease: "back.out(1.7)",
            },
        );
    }

    /* -------------------------------- */
    /* LOGO */
    /* -------------------------------- */

    gsap.to(menuLogoImage, {
        rotation: 360,
        scale: 1.08,
        duration: 0.7,
        ease: "back.out(2)",
    });

    /* -------------------------------- */
    /* TOGGLER RING */
    /* -------------------------------- */

    gsap.to(togglerRing, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(2)",
    });

    /* -------------------------------- */
    /* DRAWER SHADOW */
    /* -------------------------------- */

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

    /* -------------------------------- */
    /* ITEMS */
    /* -------------------------------- */

    gsap.to(menuItemElements, {
        opacity: 0,
        scale: 0.7,
        y: 8,
        x: 0,
        rotationX: 12,
        duration: 0.3,
        stagger: {
            each: 0.04,
            from: "end",
        },
        ease: "power3.in",
    });

    /* -------------------------------- */
    /* MOBILE */
    /* -------------------------------- */

    if (isMobile()) {
        gsap.to(menuItems, {
            height: 0,
            duration: 0.5,
            delay: 0.08,
            ease: "expo.inOut",
        });

        gsap.delayedCall(0.55, () => {
            updateDragBounds();
        });
    } else {
        /* -------------------------------- */
        /* DESKTOP */
        /* -------------------------------- */

        gsap.to(menuItems, {
            width: 0,
            duration: 0.55,
            delay: 0.08,
            ease: "expo.inOut",
        });
    }

    /* -------------------------------- */
    /* LOGO */
    /* -------------------------------- */

    gsap.to(menuLogoImage, {
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
    });

    /* -------------------------------- */
    /* RING */
    /* -------------------------------- */

    gsap.to(togglerRing, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
    });

    /* -------------------------------- */
    /* SHADOW */
    /* -------------------------------- */

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

let draggable = null;

draggable = Draggable.create(menuDrawer, {
    type: "x,y",

    bounds: getDrawerBounds(),

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

        showDragLabel();
    },

    onDrag() {
        pointerMoved = true;
        isDragging = true;

        /* -------------------------------- */
        /* VELOCITY */
        /* -------------------------------- */

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

        /*
         * On mobile we don't need mouse magnetism.
         */
        if (isMobile()) return;

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

    /*
     * Avoid hover effects on touch devices.
     */
    if (isMobile()) return;

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
    if (isMobile()) return;

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
    location.reload();

    const mobile = isMobile();

    calculateMenuDimensions();

    if (mobile) {
        /*
         * Switch to mobile layout.
         */

        gsap.set(menuItems, {
            width: "100%",
        });

        if (isMenuOpen) {
            gsap.set(menuItems, {
                height: menuItemsFullHeight,
            });
        } else {
            gsap.set(menuItems, {
                height: 0,
            });
        }
    } else {
        /*
         * Switch back to desktop layout.
         */

        gsap.set(menuItems, {
            height: 0,
        });

        if (isMenuOpen) {
            gsap.set(menuItems, {
                width: menuItemsFullWidth,
            });
        } else {
            gsap.set(menuItems, {
                width: 0,
            });
        }
    }

    /*
     * Reset item transforms after breakpoint change.
     */
    gsap.set(menuItemElements, {
        x: 0,
    });

    updateDragBounds();
});
