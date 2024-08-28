/*
 *
 * HomePage
 *
 */

import React from "react";
import pluginId from "../../pluginId";
import * as S from "@strapi/design-system";

const HomePage = () => {
  return (
    <S.Flex direction="column" gap={4}>
      <S.Typography>
        Password<span style={{ color: "red", marginLeft: "8px" }}>*</span>
      </S.Typography>
      <S.Field/>
    </S.Flex>
  );
};

export default HomePage;
