import PropTypes from 'prop-types'

import goatIcon from '../assets/goat.svg'
import chickenIcon from '../assets/chicken.svg'
import pigIcon from '../assets/pig.svg'
import horseIcon from '../assets/horse.svg'
import crabIcon from '../assets/crab.svg'
import duckIcon from '../assets/duck.svg'
import penguinIcon from '../assets/penguin.svg'
import spiderIcon from '../assets/spider.svg'
import logoIcon from '../assets/logo.svg'
import saleIcon from '../assets/sale.svg'
import bestIcon from '../assets/best.svg'
import dollarIcon from '../assets/dollar.svg'

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
  spider: spiderIcon,
  logo: logoIcon,
  'On sale': saleIcon,
  'Best rated': bestIcon,
  'Under $5': dollarIcon
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
  mdiChevronLeft,
  mdiCopyright,
  mdiGithub,
  mdiCashMultiple,
  mdiCreationOutline, 
  mdiFilterVariant,
  mdiChevronUp,
  mdiChevronDown,
  mdiHelp
} from '@mdi/js';

const NewIcon = function ({assignClass}) {
  let assignPath;
  switch (assignClass) {
    case 'box-empty':
      assignPath = mdiPackageVariant;
      break;
    
    case 'cash':
      assignPath = mdiCashMultiple;
      break;

    case 'cart':
      assignPath = mdiCartOutline;
      break;
    
    case 'check':
      assignPath = mdiCheck;
      break;

    case 'close':
      assignPath = mdiClose;
      break;
    
    case 'copyright':
      assignPath = mdiCopyright;
      break;

    case 'delete':
      assignPath = mdiTrashCanOutline;
      break;
    
    case 'deliver':
      assignPath = mdiTruckFastOutline;
      break;
    
    case 'delivered':
      assignPath = mdiPackageVariantClosedCheck;
      break;

    case 'down':
      assignPath = mdiChevronDown;
      break;

    case 'edit':
      assignPath = mdiPencilOutline;
      break;

    case 'empty':
      assignPath = mdiBorderNoneVariant;
      break;
    
    case 'filter':
      assignPath = mdiFilterVariant;
      break;

    case 'github':
      assignPath = mdiGithub;
      break;

    case 'help':
      assignPath = mdiHelp;
      break;
  
    case 'line':
      assignPath = mdiMinus;
      break;

    case 'location':
      assignPath = mdiMapMarkerOutline;
      break;

    case 'next':
      assignPath = mdiChevronRight;
      break;
        
    case 'previous':
      assignPath = mdiChevronLeft;
      break;

    case 'back':
      assignPath = mdiChevronLeft;
      break;

    case 'profile':
      assignPath = mdiAccountOutline;
      break;
    
    case 'send':
      assignPath = mdiCubeSend;
      break;
    
    case 'shop':
      assignPath = mdiStorefrontOutline;
      break;

    case 'stars':
      assignPath = mdiCreationOutline;
      break;
    
    case 'truck-empty':
      assignPath = mdiTruckOutline;
      break;

    case 'up':
      assignPath = mdiChevronUp;
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

const CategoryIcon = function ({assignClass, assignAltText}) {
  return (
    <img src={importIcons[assignClass]} alt={assignAltText} className={`animal-icon ${assignClass}`}/>
  )
} 

CategoryIcon.propTypes = {
  assignClass: PropTypes.string,
  assignAltText: PropTypes.string
}

const AnimalImage = function ({assignClass}) {
  return (
    <img src={importImage[assignClass]} alt="" className={`animal-image ${assignClass}`}/>
  )
} 

AnimalImage.propTypes = {
  assignClass: PropTypes.string
}

export { NewIcon, CategoryIcon, AnimalImage }