function Validator(
    formSelector,
    itemsValidate,
    errorMessages,
    formGroupSelector,
    messageSelector,
    onSubmit = () => {}
) {
    const validationRules = {
        isRequired: (inputName, errorMessage) => {
            const inputElement = formElement.querySelector(`[name="${inputName}"]`);

            if (inputElement.type == "radio" || inputElement.type == "checkbox") {
                const checkedLength = formElement.querySelectorAll(`[name="${inputName}"]:checked`).length;
                errorMessage = errorMessage || "Please select an option.";

                return checkedLength ? undefined : errorMessage;
            } else {
                const value = inputElement.value;
                errorMessage = errorMessage || "Please enter a value.";

                return value ? undefined : errorMessage;
            }
        },

        email: (inputName, errorMessage = "Please enter a valid email address.") => {
            const value = formElement.querySelector(`[name="${inputName}"]`).value;
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            return regex.test(value) ? undefined : errorMessage;
        },

        min: (inputName, minLength, errorMessage) => {
            const inputElement = formElement.querySelector(`[name="${inputName}"]`);

            if (inputElement.type == "checkbox") {
                const checkedLength = formElement.querySelectorAll(`[name="${inputName}"]:checked`).length;
                errorMessage = errorMessage || `Please select at least ${minLength} checkboxes.`;

                return checkedLength >= Number(minLength) ? undefined : errorMessage;
            } else {
                const value = inputElement.value;
                errorMessage = errorMessage || `Please enter at least ${minLength} characters.`;

                return value.length >= Number(minLength) ? undefined : errorMessage;
            }
        },

        same: (inputName, sameName, errorMessage = `Please enter a value matching the field ${requiredValue}.`) => {
            const value = formElement.querySelector(`[name="${inputName}"]`).value;
            const sameValue = formElement.querySelector(`[name="${sameName}"]`).value;

            return value === sameValue ? undefined : errorMessage;
        },

        regex: (inputName, regexString, errorMessage = `Please enter the value in the specified format.`) => {
            const value = formElement.querySelector(`[name="${inputName}"]`).value;
            const regex = new RegExp(regexString.slice(1, -1));

            return regex.test(value) ? undefined : errorMessage;
        },
    };

    const findFormGroup = (inputElement) => {
        if (!inputElement.parentElement) {
            return undefined;
        }

        if (inputElement.parentElement.matches(formGroupSelector)) {
            return inputElement.parentElement;
        } else {
            return findFormGroup(inputElement.parentElement);
        }
    };

    const setResult = (result, itemValidateElement, errorMessage) => {
        const formGroupElement = findFormGroup(itemValidateElement);

        if (!formGroupElement) {
            throw new Error(`Can not find form group of input[name="${itemValidateElement.name}"] in Validator()`);
            return;
        }

        const messageElement = formGroupElement.querySelector(messageSelector);

        if (result === "invalid") {
            formGroupElement.classList.add("invalid");
            messageElement.innerText = errorMessage;
        } else if (result === "valid") {
            formGroupElement.classList.remove("invalid");
            messageElement.innerText = "";
        }
    };

    const validate = (itemValidateName, rules) => {
        for (let rule of rules) {
            const requiredValue = rule.split(":")[1];
            rule = rule.split(":")[0];
            let errorMessage;

            if (requiredValue) {
                if (rule == "isRequired" || rule == "email") {
                    console.log("isRequired and email do not receive the required value in Validator()");
                }

                errorMessage = validationRules[rule](
                    itemValidateName,
                    requiredValue,
                    errorMessages[`${itemValidateName}.${rule}`]
                );
            } else {
                errorMessage = validationRules[rule](itemValidateName, errorMessages[`${itemValidateName}.${rule}`]);
            }

            if (errorMessage) {
                return errorMessage;
            }
        }
    };

    if (!formSelector || !itemsValidate || !errorMessages || !formGroupSelector || !messageSelector) {
        throw new Error("Please pass all the arguments to Validator()");
    }

    const formElement = document.querySelector(formSelector);

    // Validate when form submit
    if (formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault();

            let isValid = true;

            for (let itemValidateName in itemsValidate) {
                const itemValidateElements = formElement.querySelectorAll(`[name="${itemValidateName}"]`);
                const rules = itemsValidate[itemValidateName].split("|").map((item) => item.trim());

                if (itemValidateElements.length <= 0) {
                    throw new Error(`Can not find input[name="${itemValidateName}"] in Validator()`);
                    return;
                }

                for (let itemValidateElement of itemValidateElements) {
                    const errorMessage = validate(itemValidateName, rules);

                    if (errorMessage) {
                        setResult("invalid", itemValidateElement, errorMessage);
                        isValid = false;
                    } else {
                        setResult("valid", itemValidateElement, errorMessage);
                    }
                }
            }

            if (isValid) {
                // Get all form items
                const formItems = formElement.querySelectorAll("[name]:not([disabled])");
                const formValue = {};

                formItems.forEach((formItem) => {
                    const { type, name, value, checked } = formItem;

                    switch (type) {
                        case "checkbox":
                            if (checked) {
                                formValue[name] = formValue[name] || [];
                                formValue[name].push(value);
                            }
                            break;

                        case "radio":
                            if (checked) {
                                formValue[name] = value;
                            }
                            break;

                        default:
                            formValue[name] = value;
                            break;
                    }
                });

                onSubmit(formValue);
            }
        };
    } else {
        console.log(`Can not find form ${formSelector}`);
    }

    // Validate when blur input
    for (let itemValidateName in itemsValidate) {
        const itemValidateElements = formElement.querySelectorAll(`[name="${itemValidateName}"]`);
        const rules = itemsValidate[itemValidateName].split("|").map((item) => item.trim());

        if (itemValidateElements.length <= 0) {
            throw new Error(`Can not find input[name="${itemValidateName}"] in Validator()`);
            return;
        }

        for (let itemValidateElement of itemValidateElements) {
            itemValidateElement.onblur = () => {
                const errorMessage = validate(itemValidateName, rules);

                if (errorMessage) {
                    setResult("invalid", itemValidateElement, errorMessage);
                } else {
                    setResult("valid", itemValidateElement, errorMessage);
                }
            };

            itemValidateElement.oninput = () => {
                setResult("valid", itemValidateElement, "");
            };
        }
    }
}
