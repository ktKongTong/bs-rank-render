
import * as countryIcons from 'country-flag-icons/react/3x2'

const Flags = ({ flagNationCode }:{flagNationCode:string}) => {
    const Flag = countryIcons[flagNationCode.toUpperCase() as keyof typeof countryIcons];
    return (
      <Flag className='h-4 aspect-[3/2] rounded'/>
    );
};

export default Flags