import * as React from "react";
import * as S from "@strapi/design-system";
import { useIntl } from "react-intl";
import * as I from "@strapi/icons";
import { useCMEditViewDataManager, auth } from "@strapi/helper-plugin";
import {
  debounce,
  decryptPassword,
  encryptPassword,
  generateStrongPassword,
} from "../../utils/function";
import apis from "../../utils/apis";

const Input = React.forwardRef((props, ref) => {
  const { attribute, intlLabel, name, onChange, value } = props;
  const [inputValue, setInputValue] = React.useState(value ?? "");
  const { isCreatingEntry, modifiedData } = useCMEditViewDataManager();
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { getUserInfo } = auth;
  const [editPass, setEditPass] = React.useState({
    newPass: "",
    accPass: "",
  });

  const { formatMessage } = useIntl();

  const debouncedEditPass = React.useCallback(
    debounce((value) => {
      let encryptedValue = "";
      if (value && value !== "") {
        encryptedValue = encryptPassword(value);
      }
      setEditPass((prev) => ({ ...prev, newPass: encryptedValue }));
    }, 1000),
    []
  );

  const handleSetNewPass = (value) => {
    setEditPass((prev) => ({ ...prev, newPass: value }));
    debouncedEditPass(value);
  };

  const onClearForm = () => {
    setEditPass((prev) => ({
      ...prev,
      newPass: "",
      accPass: "",
    }));
  };

  const debouncedHandleChange = React.useCallback(
    debounce((value) => {
      let encryptedValue = "";
      if (value && value !== "") {
        encryptedValue = encryptPassword(value);
      }
      setInputValue(encryptedValue);
      onChange({
        target: { name, type: attribute.type, value: encryptedValue },
      });
    }, 1000),
    []
  );

  const handleChange = (e) => {
    setInputValue(e.currentTarget.value);
    isCreatingEntry && debouncedHandleChange(e.currentTarget.value);
  };

  const handleChangePass = async () => {
    setLoading(true);
    await apis
      .post({
        url: `api/vu/${modifiedData.id}`,
        data: {
          data: {
            pass: `${getUserInfo().id}/%${process.env.APP_SECRET_KEY.substring(
              0,
              3
            )}/%${encryptPassword(editPass.accPass)}`,
          },
        },
      })
      .then((res) => {
        if (res.data.status) {
          setInputValue(editPass.newPass);
          onChange({
            target: { name, type: attribute.type, value: editPass.newPass },
          });
          setShowModal(false);
          onClearForm();
          alert("Update successfully");
        } else {
          alert("Permission Denied! Please Try Again Later!");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("Something went wrong: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <S.Field name={name} required={true} style={{ width: "100%" }}>
      <S.Flex direction="column" alignItems="stretch" gap={1}>
        <S.FieldLabel>{formatMessage(intlLabel)}</S.FieldLabel>
        <S.Box style={{ position: "relative" }}>
          <S.FieldInput
            {...props}
            disabled={!isCreatingEntry}
            value={inputValue}
            type="password"
            onChange={(e) => handleChange(e)}
          />
          <S.Flex
            gap={1}
            direction="row"
            alignItems="center"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {inputValue && inputValue.trim() !== "" && (
              <S.Box
                onClick={() => {
                  const text = decryptPassword(inputValue);

                  navigator.clipboard
                    .writeText(text)
                    .then(() => alert("Copy success!"))
                    .catch((err) =>
                      alert(`Something went wrong: ${err.message}`)
                    );
                }}
              >
                <I.Duplicate />
              </S.Box>
            )}
            {isCreatingEntry && (
              <S.Box
                onClick={() => {
                  const strongPassword = generateStrongPassword(20);
                  if (!isCreatingEntry) {
                    if (
                      confirm("You are change this password... Are you sure?")
                    ) {
                      setInputValue(strongPassword);
                      handleChange({
                        currentTarget: { value: strongPassword },
                      });
                    }
                  } else {
                    setInputValue(strongPassword);
                    handleChange({ currentTarget: { value: strongPassword } });
                  }
                }}
              >
                <I.Refresh />
              </S.Box>
            )}
            {!isCreatingEntry && (
              <S.Box
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <I.Pencil />
              </S.Box>
            )}
          </S.Flex>
        </S.Box>
      </S.Flex>
      <S.Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={"Edit Entry"}
      >
        <S.DialogBody>
          <S.Flex direction="column" alignItems="stretch" gap={4}>
            <S.Field name={"new-password"} required={true}>
              <S.Flex direction="column" gap={1} alignItems="stretch">
                <S.FieldLabel>New Password</S.FieldLabel>
                <S.Box style={{ position: "relative" }}>
                  <S.FieldInput
                    value={editPass.newPass}
                    type="password"
                    onChange={(e) => handleSetNewPass(e.currentTarget.value)}
                  />
                  <S.Box
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const strongPassword = generateStrongPassword(20);
                      handleSetNewPass(strongPassword);
                    }}
                  >
                    <I.Refresh />
                  </S.Box>
                </S.Box>
              </S.Flex>
            </S.Field>
            <S.TextInput
              label="Your Account Password"
              required
              value={editPass.accPass}
              type="password"
              onChange={(e) => {
                setEditPass((prev) => ({
                  ...prev,
                  accPass: e.currentTarget.value,
                }));
              }}
            />
          </S.Flex>
        </S.DialogBody>
        <S.DialogFooter
          startAction={
            <S.Button
              onClick={() => {
                setShowModal(false);
                setEditPass((prev) => ({ ...prev, accPass: "", newPass: "" }));
              }}
              variant="tertiary"
            >
              Cancel
            </S.Button>
          }
          endAction={
            <S.Button disabled={loading} onClick={handleChangePass}>
              Confirm
            </S.Button>
          }
        />
      </S.Dialog>
    </S.Field>
  );
});

export default Input;
