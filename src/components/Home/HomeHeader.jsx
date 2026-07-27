import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FiMessageSquare } from "react-icons/fi";
import { HiOutlineBell } from "react-icons/hi";
import DropDown from "../Layout/DropDown";
import Navbar from "../Layout/Navbar";
import LanguageSwitcher from "../LanguageSwitcher";
import YEBOSearchSparkle from "./YEBOSearchSparkle";
import YEBOSearchCamera from "./YEBOSearchCamera";
import HeaderThemeToggle from "./HeaderThemeToggle";
import MobileCategoriesPanel from "./MobileCategoriesPanel";
import { CountrySwitcher } from "../Layout/overlays";
import { buildMobileNavCategories } from "./mainCategoryHierarchy";
import useSiteSearch from "../../hooks/useSiteSearch";
import useInboxUnreadCount from "../../hooks/useInboxUnreadCount";
import useNotificationUnreadCount from "../../hooks/useNotificationUnreadCount";
import { Container } from "../ui";
import { useAIOptional } from "../ai/core/AIContext";
import MobileCreateActionSheet from "../seller-experience/MobileCreateActionSheet";
import ProfileHub from "../Layout/ProfileHub";
import CreateMenuPopover from "../Layout/CreateMenuPopover";
import YeboneLogo from "./YeboneLogo";
import SkipToContent from "../Layout/SkipToContent";
import { useBreakpoint } from "../../design-system/responsive/useBreakpoint";
import { useMarketplaceMode } from "../../context/MarketplaceModeContext";
import { SELLER_DASHBOARD_PATH } from "../../utils/sellerNav";
import "./home.css";
import "./profileHub.css";

const HomeHeader = ({ activeHeading: _activeHeading }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { setMode } = useMarketplaceMode();
  const ai = useAIOptional();
  const { count: inboxUnread } = useInboxUnreadCount(isAuthenticated);
  const { count: notificationUnread } = useNotificationUnreadCount(isAuthenticated);
  const breakpoint = useBreakpoint();
  const isSheetProfile = breakpoint === "mobile" || breakpoint === "tablet";

  const [dropDown, setDropDown] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const profileRef = useRef(null);
  const createRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    searchTerm,
    searchData,
    handleSearchChange,
    handleSearchSubmit,
    setSearchData,
  } = useSiteSearch();

  const marketplaceNavCategories = useMemo(() => buildMobileNavCategories(), []);
  const inboxPath = isSeller ? "/dashboard-messages" : "/inbox";

  const openYebo = () => {
    ai?.setShoppingMode?.("chat");
    ai?.openPanel?.();
  };

  const openVisualSearch = () => {
    ai?.setShoppingMode?.("visual");
    ai?.openPanel?.();
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!dropDown) return undefined;

    const updateMegaMenuTop = () => {
      const headerEl = document.querySelector(".home-header");
      if (!headerEl) return;
      const { bottom } = headerEl.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--home-mega-menu-top",
        `${bottom + 8}px`
      );
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setDropDown(false);
    };

    updateMegaMenuTop();
    window.addEventListener("resize", updateMegaMenuTop);
    window.addEventListener("scroll", updateMegaMenuTop, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", updateMegaMenuTop);
      window.removeEventListener("scroll", updateMegaMenuTop);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropDown]);

  const renderBadge = (value) =>
    value > 0 ? (
      <span className="home-header__badge" aria-hidden="true">
        {value > 9 ? "9+" : value}
      </span>
    ) : null;

  const renderInboxLink = () => (
    <Link
      to={isAuthenticated ? inboxPath : "/login"}
      className="home-header__icon-btn"
      aria-label="Inbox"
    >
      <FiMessageSquare size={20} />
      {isAuthenticated && renderBadge(inboxUnread)}
    </Link>
  );

  const renderNotificationsButton = () => (
    <button
      type="button"
      className="home-header__icon-btn"
      aria-label="Notifications"
      onClick={() => {
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
        navigate("/profile", { state: { active: 12 } });
      }}
    >
      <HiOutlineBell size={20} />
      {isAuthenticated && renderBadge(notificationUnread)}
    </button>
  );

  const renderMyShopButton = () => {
    if (!isSeller) return null;

    return (
      <Link
        to={SELLER_DASHBOARD_PATH}
        onClick={() => setMode("seller")}
        className="home-header__shop-pill"
      >
        My Shop
      </Link>
    );
  };

  const renderCreateButton = () => {
    if (!isSeller) return null;

    const createBtn = (
      <button
        type="button"
        className="home-header__create-btn"
        onClick={() => {
          if (isSheetProfile) {
            setCreateSheetOpen(true);
            return;
          }
          setCreateOpen((v) => !v);
        }}
        aria-expanded={!isSheetProfile && createOpen}
        aria-haspopup="menu"
        aria-label="Create new listing"
      >
        <AiOutlinePlus size={16} />
      </button>
    );

    if (isSheetProfile) return createBtn;

    return (
      <div className="home-header__create-wrap relative" ref={createRef}>
        {createBtn}
        <CreateMenuPopover
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          anchorRef={createRef}
        />
      </div>
    );
  };

  const renderProfileButton = () => (
    <div className="home-header__profile-wrap relative" ref={profileRef}>
      <button
        type="button"
        onClick={() => setProfileOpen(true)}
        className="home-header__profile-btn"
        aria-expanded={profileOpen}
        aria-haspopup="true"
        aria-label={isAuthenticated ? "Account menu" : "Sign in"}
      >
        {isAuthenticated && user?.avatar?.url ? (
          <img src={user.avatar.url} alt="" className="home-header__avatar" />
        ) : (
          <div className="home-header__avatar home-header__avatar--placeholder">
            <CgProfile size={20} className="text-yebone-primary" />
          </div>
        )}
      </button>
      {!isSheetProfile && (
        <ProfileHub
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          variant="popover"
          anchorRef={profileRef}
        />
      )}
    </div>
  );

  return (
    <>
      <SkipToContent />
      <header
        className={`home-header sticky top-0 z-50 home-glass shadow-sm${
          isScrolled ? " home-header--scrolled" : ""
        }`}
      >
        <div className="home-header__utility hidden lg:block">
          <Container className="home-header__utility-inner">
            <p className="home-header__utility-tagline">Yebone — Everything in one place</p>
            <div className="home-header__utility-actions">
              <CountrySwitcher />
              <span className="home-header__utility-divider" aria-hidden="true" />
              <LanguageSwitcher />
              {!isAuthenticated && (
                <>
                  <span className="home-header__utility-divider" aria-hidden="true" />
                  <Link to="/login" className="text-sm font-medium text-yebone-primary hover:underline px-1">
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-sm font-semibold px-4 py-1.5 rounded-full bg-yebone-primary text-white hover:bg-yebone-primary-dark transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>

        <Container className="home-header__main">
          <div className="home-header__main-row">
            <div className="home-header__brand shrink-0">
              <YeboneLogo size="md" className="home-header__logo" />
              <span className="home-header__logo-tagline hidden lg:block">
                Everything in one place
              </span>
            </div>

            <div
              className={`home-header__categories-wrap hidden lg:block shrink-0${
                dropDown ? " is-open" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setDropDown(!dropDown)}
                className={`home-header__categories-btn flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--home-border)] bg-[var(--home-surface-muted)] hover:bg-[var(--home-surface-muted)] font-medium text-sm text-[var(--home-text)] transition${
                  dropDown ? " is-active" : ""
                }`}
                aria-expanded={dropDown}
                aria-haspopup="menu"
              >
                <BiMenuAltLeft size={22} />
                Categories
              </button>
              {dropDown && (
                <>
                  <button
                    type="button"
                    className="yebone-nav-mega-backdrop"
                    onClick={() => setDropDown(false)}
                    aria-label="Close categories menu"
                  />
                  <DropDown categoriesData={marketplaceNavCategories} setDropDown={setDropDown} />
                </>
              )}
            </div>

            <div className="home-header__search-row">
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(true)}
                className="home-header__categories-mobile"
                aria-label="Browse categories"
                aria-expanded={mobileCategoriesOpen}
              >
                <BiMenuAltLeft size={20} aria-hidden="true" />
              </button>

              <form
                onSubmit={handleSearchSubmit}
                className="home-header__search-form flex-1 relative min-w-0"
              >
                <div className="home-header__search-shell">
                  <AiOutlineSearch size={18} className="home-header__search-icon shrink-0" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="home-header__search-input"
                    enterKeyHint="search"
                  />
                  <div className="home-header__search-actions">
                    <YEBOSearchCamera onClick={openVisualSearch} />
                    <YEBOSearchSparkle onClick={openYebo} />
                  </div>
                </div>

                {searchData?.length > 0 && (
                  <div className="home-search-suggest" role="listbox" aria-label="Search suggestions">
                    <div className="home-search-suggest__scroll">
                      {searchData.slice(0, 8).map((item) => {
                        const meta =
                          item.shop?.name ||
                          item.category ||
                          (item.type === "flashsale"
                            ? "Flash Sale"
                            : item.type === "bid"
                            ? "Auction"
                            : null);

                        return (
                          <Link
                            key={`${item.type || "product"}-${item._id}`}
                            to={`/product/${item._id}`}
                            onClick={() => setSearchData(null)}
                            className="home-search-suggest__row"
                            role="option"
                          >
                            <span className="home-search-suggest__thumb">
                              <img src={item.images?.[0]?.url} alt="" loading="lazy" decoding="async" />
                            </span>
                            <span className="home-search-suggest__body">
                              <span className="home-search-suggest__title">{item.name}</span>
                              {meta && <span className="home-search-suggest__meta">{meta}</span>}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="home-header__actions shrink-0">
              {renderMyShopButton()}
              {renderInboxLink()}
              {renderNotificationsButton()}
              <HeaderThemeToggle />
              {renderCreateButton()}
              {renderProfileButton()}
            </div>
          </div>
        </Container>

        <div className="home-header__nav-strip hidden lg:block">
          <Container className="home-header__nav-inner">
            <Navbar />
          </Container>
        </div>
      </header>

      {isSheetProfile && (
        <ProfileHub
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          variant="sheet"
          anchorRef={profileRef}
        />
      )}

      <MobileCreateActionSheet open={createSheetOpen} onClose={() => setCreateSheetOpen(false)} />

      {isSheetProfile && (
        <MobileCategoriesPanel
          open={mobileCategoriesOpen}
          onClose={() => setMobileCategoriesOpen(false)}
          categoriesData={marketplaceNavCategories}
        />
      )}
    </>
  );
};

export default HomeHeader;
