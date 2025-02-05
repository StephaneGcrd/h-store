import {FullStarIcon, HalfStarIcon} from '../icons';

export const StarLine = ({note, className}) => {
  const ratingFloat = parseFloat(note);
  if (ratingFloat < 1) return <HalfStarIcon className={className} />;
  else if (ratingFloat < 1.5) {
    return (
      <>
        <FullStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 2) {
    return (
      <>
        <FullStarIcon className={className} />
        <HalfStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 2.5) {
    return (
      <>
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 3) {
    return (
      <>
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <HalfStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 3.5) {
    return (
      <>
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 4) {
    return (
      <>
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <HalfStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 4.5) {
    return (
      <>
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
      </>
    );
  } else if (ratingFloat < 5) {
    return (
      <>
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <FullStarIcon className={className} />
        <HalfStarIcon className={className} />
      </>
    );
  }

  return (
    <>
      <FullStarIcon className={className} />
      <FullStarIcon className={className} />
      <FullStarIcon className={className} />
      <FullStarIcon className={className} />
      <FullStarIcon className={className} />
    </>
  );
};
