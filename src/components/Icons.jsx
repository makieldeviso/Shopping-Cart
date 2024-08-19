import PropTypes from 'prop-types'

import goatIcon from '../assets/goat.svg'
import chickenIcon from '../assets/chicken.svg'
import pigIcon from '../assets/pig.svg'
import horseIcon from '../assets/horse.svg'
import crabIcon from '../assets/crab.svg'
import duckIcon from '../assets/duck.svg'
import penguinIcon from '../assets/penguin.svg'
import spiderIcon from '../assets/spider.svg'

import goatImage from '../assets/goat-img.jpg'
import chickenImage from '../assets/chicken-img.jpg'
import pigImage from '../assets/pig-img.jpg'
import horseImage from '../assets/horse-img.jpg'
import crabImage from '../assets/crab-img.jpg'
import duckImage from '../assets/duck-img.jpg'
import penguinImage from '../assets/penguin-img.jpg'
import spiderImage from '../assets/spider-img.jpg'

const importIcons = {
  goat: goatIcon,
  chicken: chickenIcon,
  pig: pigIcon,
  horse: horseIcon,
  crab: crabIcon,
  duck: duckIcon,
  penguin: penguinIcon,
  spider: spiderIcon
}

const importImage = {
  goat: goatImage,
  chicken: chickenImage,
  pig: pigImage,
  horse: horseImage,
  crab: crabImage,
  duck: duckImage,
  penguin: penguinImage,
  spider: spiderImage
}

import Icon from '@mdi/react';
import { 
  mdiTrashCanOutline,
  mdiPencilOutline,
  mdiAccountOutline,
  mdiStorefrontOutline,
  mdiCartOutline,
  mdiClose,
  mdiCheck,
  mdiMapMarkerOutline,
  mdiCubeSend,
  mdiPackageVariant,
  mdiTruckOutline,
  mdiBorderNoneVariant,
  mdiTruckFastOutline,
  mdiPackageVariantClosedCheck,
  mdiMinus,
  mdiChevronRight,
  mdiChevronLeft  
} from '@mdi/js';

const NewIcon = function ({assignClass}) {
  let assignPath;
  switch (assignClass) {
    case 'delete':
      assignPath = mdiTrashCanOutline;
      break;
  
    case 'edit':
      assignPath = mdiPencilOutline;
      break;
    
    case 'line':
      assignPath = mdiMinus;
      break;

    case 'close':
      assignPath = mdiClose;
      break;

    case 'check':
      assignPath = mdiCheck;
      break;

    case 'location':
      assignPath = mdiMapMarkerOutline;
      break;

    case 'profile':
      assignPath = mdiAccountOutline;
      break;

    case 'send':
      assignPath = mdiCubeSend;
      break;
    
    case 'deliver':
      assignPath = mdiTruckFastOutline;
      break;
    
    case 'delivered':
      assignPath = mdiPackageVariantClosedCheck;
      break;

    case 'shop':
      assignPath = mdiStorefrontOutline;
      break;
    
    case 'cart':
      assignPath = mdiCartOutline;
      break;

    case 'box-empty':
      assignPath = mdiPackageVariant;
      break;

    case 'truck-empty':
      assignPath = mdiTruckOutline;
      break;
    
    case 'empty':
      assignPath = mdiBorderNoneVariant;
      break;

    case 'previous':
      assignPath = mdiChevronLeft;
      break;

    case 'next':
      assignPath = mdiChevronRight;
      break;
  
    default:
      console.log('path not found')
      break;
  }

  const iconProps = {
    style: {pointerEvents: 'none'},
    className: assignClass ? `${assignClass}-icon`: '',
    path: assignPath
  }

  return (
    <Icon {...iconProps}/>
  )
}

NewIcon.propTypes = {
  assignClass: PropTypes.string
}

const AnimalIcon = function ({assignClass}) {
  
  return (
    <img src={importIcons[assignClass]} alt="" className={`animal-icon ${assignClass}`}/>
  )
} 

const AnimalImage = function ({assignClass}) {
  
  return (
    <img src={importImage[assignClass]} alt="" className={`animal-image ${assignClass}`}/>
  )
} 

export { NewIcon, AnimalIcon, AnimalImage }