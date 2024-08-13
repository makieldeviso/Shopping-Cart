import PropTypes from 'prop-types'

import goatIcon from '../assets/goat.svg'
import chickenIcon from '../assets/chicken.svg'
import pigIcon from '../assets/pig.svg'
import horseIcon from '../assets/horse.svg'
import crabIcon from '../assets/crab.svg'
import duckIcon from '../assets/duck.svg'
import penguinIcon from '../assets/penguin.svg'
import spiderIcon from '../assets/spider.svg'

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

    case 'left':
      assignPath = mdiChevronLeft;
      break;

    case 'right':
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

export { NewIcon, AnimalIcon }