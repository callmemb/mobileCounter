
// import React, { useState } from 'react';

// interface IconPickerProps {
//   onIconSelect: (iconName: string) => void;
// }

// const IconPicker: React.FC<IconPickerProps> = ({ onIconSelect }) => {
//   const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
//   const iconNames = Object.keys(Icons);

//   const handleIconClick = (iconName: string) => {
//     setSelectedIcon(iconName);
//     onIconSelect(iconName);
//   };

//   return (
//     <Grid container spacing={2}>
//       {iconNames.map((iconName) => {
//         const IconComponent = Icons[iconName as keyof typeof Icons];
//         return (
//           <Grid item key={iconName}>
//             <IconButton
//               color={selectedIcon === iconName ? 'primary' : 'default'}
//               onClick={() => handleIconClick(iconName)}
//             >
//               <IconComponent />
//             </IconButton>
//           </Grid>
//         );
//       })}
//     </Grid>
//   );
// };

// export default IconPicker;