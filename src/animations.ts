
export const popIn = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
      },
    },
  };
  
  
  
  

export const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // Medium rhythm
        delayChildren: 0.05,
      },
    },
  };
  