gsap.registerPlugin(Draggable);

const menuDropZone = document.querySelector(".menu-drop-zone");
const menuDrawer = document.querySelector(".menu-drawer");
const menuLogo = document.querySelector(".menu-logo");
const menuItems = document.querySelector(".menu-items");
const menuItemElements = document.querySelectorAll(".menu-item");
const menuToggler = document.querySelector(".menu-toggler");

let isMenuOpen = false;

gsap.set(menuItems, { width: "auto" });
gsap.set(menuItemElements, { opacity: 1 });

const menuItemsFullWidth = menuItems.offsetWidth;
const drawerGap = 0.35 * 16;
const drawerPadding = 0.35 * 16;
const logoWidth = menuLogo.offsetWidth;
const togglerWidth = menuToggler.offsetWidth;

const closedMenuWidth = drawerPadding + logoWidth + drawerGap + togglerWidth + drawerPadding;
const openMenuWidth =
    drawerPadding + logoWidth + drawerGap + menuItemsFullWidth + drawerGap + togglerWidth + drawerPadding;

gsap.set(menuItems, {
    width: 0,
    marginRight: 0,
});

gsap.set(menuItemElements, {
    opacity: 0,
    scale: 0.85,
});

gsap.set(menuDropZone, {
    width: closedMenuWidth,
});

function toggleMenu() {
    if (isMenuOpen) closeMenu();
    else openMenu();

    isMenuOpen = !isMenuOpen;
}

menuToggler.addEventListener("click", toggleMenu);

function openMenu() {
    menuToggler.classList.add("close");

    gsap.to(menuItems, {
        width: menuItemsFullWidth,
        marginRight: drawerGap,
        duration: 0.5,
        ease: "power3.inOut",
        onStart: () => {
            gsap.to(menuItemElements, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                stagger: 0.05,
                delay: 0.2,
                ease: "power3.out",
            });
        },
    });
}

function closeMenu() {
    menuToggler.classList.remove("close");

    gsap.to(menuItems, {
        width: 0,
        marginRight: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onStart: () => {
            gsap.to(menuItemElements, {
                opacity: 0,
                scale: 0.85,
                duration: 0.3,
                stagger: {
                    each: 0.05,
                    from: "end",
                },
                ease: "power3.out",
            });
        },
    });
}

const snapThreshold = 200;

Draggable.create(menuDrawer, {
    type: "x,y",
    bounds: window,
    cursor: "grab",
    activeCursor: "grabbing",

    onDragStart: function () {
        const activeMenuWidth = isMenuOpen ? openMenuWidth : closedMenuWidth;

        gsap.set(menuDropZone, {
            width: activeMenuWidth,
        });
    },

    onDrag: function () {
        const isMenuWithInSnapZone = Math.abs(this.x) < snapThreshold && Math.abs(this.y) < snapThreshold;

        if (isMenuWithInSnapZone) {
            gsap.to(menuDropZone, {
                opacity: 1,
                duration: 0.1,
            });
        } else {
            gsap.to(menuDropZone, {
                opacity: 0,
                duration: 0.1,
            });
        }
    },

    onDragEnd: function () {
        gsap.to(menuDropZone, {
            opacity: 0,
            duration: 0.1,
        });

        const isMenuWithInSnapZone = Math.abs(this.x) < snapThreshold && Math.abs(this.y) < snapThreshold;

        if (isMenuWithInSnapZone) {
            gsap.to(menuDropZone, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    },
});
