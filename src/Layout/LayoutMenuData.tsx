import React, { useEffect, useState } from "react";

const Navdata = () => {
  //state data

  const [isTracking, setIsTracking] = useState(false);
  const [isStudents, setIsStudents] = useState(false);
  const [isSchedle, setIsSchedle] = useState(false);
  const [isFeedbackClaims, setIsFeedbackClaims] = useState(false);
  const [isPayement, setIsPayement] = useState(false);
  const [isAccounts, setIsAccounts] = useState(false);
  const [isTools, setIsTools] = useState(false);
  const [isHelp, setIsHelp] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        // var id: any = item.getAttribute("subitems");
        // if (document.getElementById(id)){
        //     document.getElementById(id).classList.remove("show");
        // }
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (iscurrentState !== "Tracking") {
      setIsTracking(false);
    }
    if (iscurrentState !== "Students") {
      setIsStudents(false);
    }
    if (iscurrentState !== "Programming") {
      setIsSchedle(false);
    }
    if (iscurrentState !== "Feedback&Claims") {
      setIsFeedbackClaims(false);
    }
    if (iscurrentState !== "Payement") {
      setIsPayement(false);
    }
    if (iscurrentState !== "Accounts") {
      setIsAccounts(false);
    }
    if (iscurrentState !== "Tools") {
      setIsTools(false);
    }
    if (iscurrentState !== "Help") {
      setIsHelp(false);
    }
  }, [
    iscurrentState,
    isTracking,
    isStudents,
    isSchedle,
    isFeedbackClaims,
    isPayement,
    isAccounts,
    isTools,
    isHelp,
  ]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: "ph ph-gauge",
      link: "/dashboard",
    },
    {
      id: "job",
      label: "Jobs",
      icon: "ph ph-jeep",
      link: "/pushed-job",
      click: function (e: any) {
        e.preventDefault();
        setIsSchedle(!isSchedle);
        setIscurrentState("Programming");
        updateIconSidebar(e);
      },
      stateVariables: isSchedle,
      subItems: [
        {
          id: "suggestedJob",
          label: "Suggested Job",
          link: "/suggested-jobs",
          parentId: "suggestedJob",
          icon: "ph ph-suitcase-simple",
        },

        {
          id: "acceptedJob",
          icon: "ph ph-check-square",
          label: "Accepted Job",
          link: "/jobs/accepted-jobs",
          parentId: "completedJob",
        },
        {
          id: "completedJob",
          icon: "ph ph-checks",
          label: "Completed Job",
          link: "/jobs/completed-jobs",
          parentId: "completedJob",
        },
        {
          id: "canceledJob",
          label: "Cancelled Job",
          link: "/jobs/canceled-jobs",
          parentId: "pushed-job",
          icon: "ph ph-prohibit",
        },
        // {
        //   id: "refusedJob",
        //   label: "Refused Jobs",
        //   link: "/refused-jobs",
        //   parentId: "newJob",
        //   icon: "ph ph-x",
        // },
      ],
    },
    {
      id: "invoices",
      label: "Invoices",
      link: "/invoices",
      parentId: "invoices",
      icon: "ph ph-note-pencil",
    },
    {
      id: "Administration",
      label: "Administration",
      icon: "ph ph-user-gear",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsStudents(!isStudents);
        setIscurrentState("Students");
        updateIconSidebar(e);
      },
      stateVariables: isStudents,
      subItems: [
        {
          id: "Driver",
          label: "Driver",
          icon: "ph ph-identification-badge",
          link: "/drivers",
          parentId: "Driver",
        },
        {
          id: "Vehicle",
          label: "Vehicle",
          link: "/vehicles",
          parentId: "Vehicle",
          icon: "ph ph-jeep",
        },
      ],
    },
    {
      id: "profile",
      label: "Profile",
      link: "/profile",
      parentId: "profile",
      icon: "ph ph-user",
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
