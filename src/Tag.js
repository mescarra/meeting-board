import React from "react";
import PropTypes from "prop-types";

const Tag = props => {
  const {
    tag: { count = 0 }
  } = props;
  return (
    <button
      type="button"
      className={props.classNames.selectedTag}
      title="Click to remove tag"
      onClick={props.onDelete}
    >
      <span className={props.classNames.selectedTagName}>
        <b>{props.tag.name}</b> x {count}
      </span>
    </button>
  );
};

Tag.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number
  }),
  onDelete: PropTypes.func,
  classNames: PropTypes.shape({
    selectedTag: PropTypes.string,
    selectedTagName: PropTypes.string
  })
};

export default Tag;
