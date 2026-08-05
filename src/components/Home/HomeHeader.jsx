import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
import MobileCategoriesPanel from "./MobileCategoriesPanel";
import { CountrySwitcher } from "../Layout/overlays";
import { buildMobileNavCategories } from "./mainCategoryHierarchy";
import useSiteSearch from "../../hooks/useSiteSearch";
import SiteSearchDropdown from "../Search/SiteSearchDropdown";
import { COMMUNICATION_IDENTITY } from "../../config/communicationIdentity";
import { resolveInboxIdentity } from "../../config/inboxIdentity";
import useInboxUnreadCount from "../../hooks/useInboxUnreadCount";
import useNotificationUnreadCount from "../../hooks/useNotificationUnreadCount";
import { Container } from "../ui";
import { useAIOptional } from "../ai/core/AIContext";
import MobileCreateActionSheet from "../seller-experience/MobileCreateActionSheet";
import ProfileHub from "../Layout/ProfileHub";
import CreateMenuPopover from "../Layout/CreateMenuPopover";
import AuthGuestModal from "../Auth/AuthGuestModal";
import YeboneLogo from "./YeboneLogo";
import SkipToContent from "../Layout/SkipToContent";
import { useBreakpoint } from "../../design-system/responsive/useBreakpoint";
import { useMarketplaceMode } from "../../context/MarketplaceModeContext";
import { SELLER_DASHBOARD_PATH } from "../../utils/sellerNav";
import { CREATE_ACTIONS, GUEST_CREATE_ACTIONS } from "../../navigation/createActions";
import { wrapHeaderHandler } from "../../utils/headerInteractionDebug";
import "./home.css";
import "./profileHub.css";

const HomeHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { setMode } = useMarketplaceMode();
  const ai = useAIOptional();
  const inboxIdentity = resolveInboxIdentity(pathname, isSeller);
  const { count: inboxUnread } = useInboxUnreadCount(isAuthenticated, inboxIdentity);
  const { count: notificationUnread } = useNotificationUnreadCount(isAuthenticated);
  const breakpoint = useBreakpoint();
  const isCompactHeader = breakpoint === "mobile" || breakpoint === "tablet";
  const isSheetProfile = isCompactHeader;

  const createActions = isSeller ? CREATE_ACTIONS : GUEST_CREATE_ACTIONS;
  const createSheetTitle = isSeller ? "Create" : "Start selling";

  const [dropDown, setDropDown] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authGuestOpen, setAuthGuestOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const profileRef = useRef(null);
  const createRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    searchTerm,
    searchData,
    recentSearches,
    trendingSearches,
    showDiscovery,
    suggestionsLoading,
    activeIndex,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchKeyDown,
    handleQuerySelect,
    setSearchData,
  } = useSiteSearch();

  const marketplaceNavCategories = useMemo(() => buildMobileNavCategories(), []);
  const inboxPath =
    inboxIdentity === COMMUNICATION_IDENTITY.SELLER ? "/dashboard-messages" : "/inbox";

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action();
        return true;
      }
      setAuthGuestOpen(true);
      return false;
    },
    [isAuthenticated]
  );

  const openYebo = useCallback(
    wrapHeaderHandler("search-yebo", () => {
      if (ai?.openPanel) {
        ai.setShoppingMode?.("chat");
        ai.openPanel();
      } else {
        toast.info("YEBO AI is loading — try again in a moment.");
      }
    }),
    [ai]
  );

  const openVisualSearch = useCallback(
    wrapHeaderHandler("search-camera", () => {
      if (ai?.openPanel) {
        ai.setShoppingMode?.("visual");
        ai.openPanel();
      } else {
        toast.info("Visual search is loading — try again in a moment.");
      }
    }),
    [ai]
  );

  const handleProfileClick = useCallback(
    wrapHeaderHandler("profile", () => {
      setProfileOpen(true);
    }),
    []
  );

  const handleInboxClick = useCallback(
    wrapHeaderHandler("messages", () => {
      requireAuth(() => navigate(inboxPath));
    }),
    [requireAuth, navigate, inboxPath]
  );

  const handleNotificationsClick = useCallback(
    wrapHeaderHandler("notifications", () => {
      requireAuth(() => navigate("/profile", { state: { active: 12 } }));
    }),
    [requireAuth, navigate]
  );

  const handleCategoriesToggle = useCallback(
    wrapHeaderHandler("categories-desktop", () => setDropDown((v) => !v)),
    []
  );

  const handleMobileCategoriesOpen = useCallback(
    wrapHeaderHandler("categories-mobile", () => setMobileCategoriesOpen(true)),
    []
  );

  const handleCreateClick = useCallback(
    wrapHeaderHandler("create", () => {
      if (isSheetProfile) {
        setCreateSheetOpen(true);
      } else {
        setCreateOpen((v) => !v);
      }
    }),
    [isSheetProfile]
  );

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
      document.documentElement.style.setProperty("--home-mega-menu-top", `${bottom + 8}px`);
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

            <div className={`home-header__categories-wrap hidden lg:block shrink-0${dropDown ? " is-open" : ""}`}>
              <button
                type="button"
                onClick={handleCategoriesToggle}
                className={`home-header__categories-btn flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--home-border)] bg-[var(--home-surface-muted)] font-medium text-sm text-[var(--home-text)] transition${
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
                onClick={handleMobileCategoriesOpen}
                className="home-header__categories-mobile"
                aria-label="Browse categories"
                aria-expanded={mobileCategoriesOpen}
              >
                <BiMenuAltLeft size={20} aria-hidden="true" />
              </button>

              <form onSubmit={handleSearchSubmit} className="home-header__search-form flex-1 relative min-w-0">
                <div className="home-header__search-shell">
                  <AiOutlineSearch size={18} className="home-header__search-icon shrink-0" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products, properties, vehicles, events..."
                    className="home-header__search-input"
                    enterKeyHint="search"
                    aria-autocomplete="list"
                    aria-expanded={showDiscovery || searchData?.length > 0}
                  />
                  <div className="home-header__search-actions">
                    <YEBOSearchCamera onClick={openVisualSearch} />
                    <YEBOSearchSparkle onClick={openYebo} />
                  </div>
                </div>

                <SiteSearchDropdown
                  searchTerm={searchTerm}
                  searchData={searchData}
                  recentSearches={recentSearches}
                  trendingSearches={trendingSearches}
                  showDiscovery={showDiscovery}
                  isLoading={suggestionsLoading}
                  activeIndex={activeIndex}
                  onQuerySelect={handleQuerySelect}
                  setSearchData={setSearchData}
                />
              </form>
            </div>

            <div className={`home-header__actions shrink-0${isCompactHeader ? " home-header__actions--primary" : ""}`}>
              {isSeller && !isCompactHeader && (
                <Link
                  to={SELLER_DASHBOARD_PATH}
                  onClick={() => setMode("seller")}
                  className="home-header__shop-pill"
                >
                  My Shop
                </Link>
              )}

              <button
                type="button"
                className="home-header__icon-btn"
                aria-label="Messages"
                onClick={handleInboxClick}
              >
                <FiMessageSquare size={20} />
                {isAuthenticated && renderBadge(inboxUnread)}
              </button>

              <button
                type="button"
                className="home-header__icon-btn"
                aria-label="Notifications"
                onClick={handleNotificationsClick}
              >
                <HiOutlineBell size={20} />
                {isAuthenticated && renderBadge(notificationUnread)}
              </button>

              {isCompactHeader ? (
                <button
                  type="button"
                  className="home-header__create-btn"
                  onClick={handleCreateClick}
                  aria-label={isSeller ? "Create" : "Start selling"}
                >
                  <AiOutlinePlus size={18} />
                </button>
              ) : (
                <div className="home-header__create-wrap relative" ref={createRef}>
                  <button
                    type="button"
                    className="home-header__create-btn"
                    onClick={handleCreateClick}
                    aria-expanded={createOpen}
                    aria-haspopup="menu"
                    aria-label={isSeller ? "Create" : "Start selling"}
                  >
                    <AiOutlinePlus size={16} />
                  </button>
                  <CreateMenuPopover
                    open={createOpen}
                    onClose={() => setCreateOpen(false)}
                    anchorRef={createRef}
                    actions={createActions}
                    title={createSheetTitle}
                  />
                </div>
              )}

              <div className="home-header__profile-wrap relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="home-header__profile-btn"
                  aria-expanded={profileOpen || authGuestOpen}
                  aria-haspopup="dialog"
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

      <AuthGuestModal open={authGuestOpen} onClose={() => setAuthGuestOpen(false)} />

      <MobileCreateActionSheet
        open={createSheetOpen}
        onClose={() => setCreateSheetOpen(false)}
        actions={createActions}
        title={createSheetTitle}
      />

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

export default React.memo(HomeHeader);
