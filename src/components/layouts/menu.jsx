import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { getNotifications, patchReadNotifications } from "../../axios/axios";
import { formatDistance } from "date-fns";
import { Badge } from "@mui/material";
import { MdAccountCircle, MdRefresh } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountMenu = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userProfile = useSelector((state) => state.user.data);
  const userLoading = useSelector((state) => state.user.loading);
  const percentage = useSelector((state) => state.user.completionPercentage);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const [open1, setOpen1] = useState(false);
  const anchorRef1 = useRef(null);
  const handleToggle1 = () => {
    setOpen1((prevOpen1) => !prevOpen1);
    handleRefresh();
  };

  const handleClose1 = (event) => {
    if (anchorRef1.current && anchorRef1.current.contains(event.target)) {
      return;
    }

    setOpen1(false);
  };
  const [open2, setOpen2] = useState(false);
  const anchorRef2 = useRef(null);
  const handleToggle2 = () => {
    setOpen2((prevOpen2) => !prevOpen2);
    handleRefresh();
  };

  const handleClose2 = (event) => {
    if (anchorRef2.current && anchorRef2.current.contains(event.target)) {
      return;
    }

    setOpen2(false);
  };

  const handleProfile = (e) => {
    navigate(`/profile/me`, { scroll: false });
    handleClose(e);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function handleListKeyDown1(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      if (anchorRef.current) {
        anchorRef.current.focus();
      }
    }

    prevOpen.current = open;
  }, [open]);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen1 = useRef(open);
  useEffect(() => {
    if (prevOpen1.current === true && open === false) {
      if (anchorRef1.current) {
        anchorRef1.current.focus();
      }
    }

    prevOpen1.current = open;
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getNotifications(userProfile?.user?._id));
      setNotifications(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchData();
    // Mark notifications as read after refreshing
    dispatch(patchReadNotifications(userProfile?.user?._id));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, userProfile?.user?._id, navigate]);

  return (
    <Stack direction="row" className="lg:md:ml-0 ml-[-10px] lg:md:mt-0 mt-4">
      <div>
        <IconButton
          ref={anchorRef1}
          id="account-button"
          aria-controls={open1 ? "account-menu" : undefined}
          aria-expanded={open1 ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle1}
        >
          <Badge
            badgeContent={notifications?.filter((item) => !item.read).length}
            color="success"
          >
            <CircleNotificationsIcon
              sx={{
                width: 32,
                height: 32,
                color: "white",
              }}
            />
          </Badge>
        </IconButton>
        <Popper
          open={open1}
          anchorEl={anchorRef1.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose1}>
                  <MenuList
                    autoFocusItem={open1}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown1}
                    className="lg:w-[380px] w-[80vw] shadow bg-gray-50 rounded-3xl"
                  >
                    <div className="bg-gray-50  h-[50vh] w-full overflow-y-scroll p-3  absolute right-0">
                      <div className="flex items-center justify-between">
                        <p
                          tabIndex={0}
                          className="focus:outline-none mb-2 text-xl font-semibold leading-6 text-gray-800"
                        >
                          Notifications
                        </p>
                        <MdRefresh
                          className="w-6 h-6 cursor-pointer"
                          onClick={handleRefresh}
                        />
                      </div>
                      {!loading ? (
                        notifications?.map((item, index) => (
                          <div
                            className={`bg-gray-50 w-full hover:bg-gray-100 hover:rounded-lg cursor-pointer p-2  flex items-start gap-x-2 ${
                              !notifications?.length - 1 === index && "border-b"
                            }`}
                            key={index}
                            onClick={() => item.url && navigate(item.url)}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#35B900",
                                color: "white",
                                fontSize: 16,
                                borderRadius: 8,
                                marginTop: 0.5,
                              }}
                              src={item?.img}
                            >
                              KOC
                            </Avatar>
                            <div>
                              <p className="">{item?.text}</p>
                              <p className="text-sm mt-1 leading-normal font-medium text-secondary">
                                {item?.createdAt &&
                                  (({ timestamp }) => (
                                    <span>
                                      {formatDistance(
                                        new Date(timestamp),
                                        new Date(),
                                        {
                                          addSuffix: true,
                                        }
                                      )}
                                    </span>
                                  ))({ timestamp: item?.createdAt ?? 0 })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center col-span-1 lg:col-span-3 justify-center h-[30vh] mx-auto">
                          <div className="loader"></div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <hr className="w-full" />
                        <p
                          tabIndex={0}
                          className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-8 text-secondary"
                        >
                          {!loading &&
                            (notifications?.length > 1
                              ? "That's it for now"
                              : "No notifications found")}
                        </p>
                        <hr className="w-full" />
                      </div>
                    </div>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <div>
        <IconButton
          ref={anchorRef2}
          id="account-button"
          aria-controls={open2 ? "account-menu" : undefined}
          aria-expanded={open2 ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle2}
        >
          <ErrorOutlineIcon
            sx={{
              width: 32,
              height: 32,
              color: "#F87171",
            }}
          />
        </IconButton>
        <Popper
          open={open2}
          anchorEl={anchorRef2.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose2}>
                  <MenuList
                    autoFocusItem={open2}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    className="w-60  bg-gray-50 rounded-3xl"
                  >
                    {!userLoading ? (
                      <MenuItem
                        onClick={(e) => handleProfile(e)}
                        className="flex flex-col "
                      >
                        <div className="w-[120px] h-[120px] rounded-full ">
                          <div className="relative size-[120px]">
                            <svg
                              className="size-full"
                              width="36"
                              height="36"
                              viewBox="0 0 36 36"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                className="stroke-current text-primary "
                                strokeWidth="2"
                              ></circle>
                              <g className="origin-center -rotate-90 transform">
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="16"
                                  fill="none"
                                  className="stroke-current text-red-300 -500"
                                  strokeWidth="2"
                                  strokeDasharray="100"
                                  strokeDashoffset={percentage}
                                ></circle>
                              </g>
                            </svg>
                            <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                              <span className="text-center text-xl font-bold text-gray-700 ">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-secondary text-xl my-1 font-medium">
                          Complete your profile
                        </p>
                      </MenuItem>
                    ) : (
                      <div className="flex items-center col-span-1 lg:col-span-3 justify-center h-[30vh] mx-auto">
                        <div className="loader"></div>
                      </div>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      <div>
        <IconButton
          ref={anchorRef}
          id="account-button"
          aria-controls={open ? "account-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {userProfile?.user?.profile_picture ? (
            <div className="w-[32px] h-[32px] border rounded-full ">
              <img
                src={userProfile?.user?.profile_picture}
                // width={32}
                // height={32}
                alt="profile picture"
                className="object-cover rounded-full w-full h-full"
              />
            </div>
          ) : (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "#35B900",
                color: "white",
                fontSize: 12,
              }}
            >
              {(userProfile?.user?.first_name?.slice(0, 1) ?? "") +
                (userProfile?.user?.lastName?.slice(0, 1) ?? "")}
            </Avatar>
          )}
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    className="w-60  bg-gray-50 rounded-3xl"
                  >
                    {!userLoading ? (
                      <MenuItem
                        onClick={(e) => handleProfile(e)}
                        className="flex flex-col "
                      >
                        {userProfile?.user?.profile_picture ? (
                          <div className="w-[120px] h-[120px] border rounded-full ">
                            <img
                              src={userProfile?.user?.profile_picture}
                              alt="profile picture"
                              className="object-cover rounded-full w-full h-full"
                            />
                          </div>
                        ) : (
                          <Avatar
                            sx={{
                              width: 120,
                              height: 120,
                              backgroundColor: "#35B900",
                              color: "white",
                              fontSize: 16,
                            }}
                          >
                            {(userProfile?.user?.first_name?.slice(0, 1) ??
                              "") +
                              (userProfile?.user?.lastName?.slice(0, 1) ?? "")}
                          </Avatar>
                        )}

                        <p className="text-secondary text-xl my-1 font-medium">
                          {userProfile?.user?.first_name +
                            " " +
                            userProfile?.user?.lastName}
                        </p>
                      </MenuItem>
                    ) : (
                      <div className="flex items-center col-span-1 lg:col-span-3 justify-center h-[30vh] mx-auto">
                        <div className="loader"></div>
                      </div>
                    )}
                    <MenuItem onClick={() => navigate("/profile/me")}>
                      <ListItemIcon>
                        <MdAccountCircle className="w-6 h-6" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/profile/settings")}>
                      <ListItemIcon>
                        <Settings />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                    <MenuItem onClick={() => setShowConfirmationModal(true)}>
                      <ListItemIcon>
                        <Logout />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      <AnimatePresence initial={false} onExitComplete={() => null}>
        {showConfirmationModal && (
          <ConfirmationModal
            title="logout"
            loading={loading || userLoading}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={() => {
              setLoading(true);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("userId");
              setLoading(false);
              navigate("/auth/login");
            }}
          />
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default AccountMenu;
