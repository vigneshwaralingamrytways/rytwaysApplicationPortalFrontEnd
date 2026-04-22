import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from "react-icons/fc";

export const SidebarData = [
  {
    title: 'Home',
    path: '/home',
    icon: <FaIcons.FaProductHunt />
  },
  {
    title: 'Master',
    path: '/master',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Raw Material',
        path: '/Master/rawmaterials',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Process',
        path: '/master/process',
        icon: <FiIcons.FcProcess />
      },
      {
        title: 'Machines',
        path: '/masters/machines',
        icon: <FiIcons.FcProcess />
      }
    ]
  },
  {
    title: 'Products',
    path: '/products',
    icon: <FaIcons.FaProductHunt />
  }
];