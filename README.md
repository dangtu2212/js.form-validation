# Form validator

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

The Form Validator library is a lightweight JavaScript library that helps validate data in web forms. It provides utility methods to check the validity of data fields in a form and displays error messages to users when they enter incorrect data.

## Features

-   Validate data fields in forms
-   Support common data validation types such as email, phone number, address, etc.
-   Display error messages to users when they enter incorrect data
-   Easily customizable and integratable into existing web projects

## System Requirements

-   Modern web browser with JavaScript support

## Validation Rules

The Form Validator library supports several common data validation rules:

-   `isRequired`: The data field must not be empty.
-   `email`: The data field must be a valid email address.
-   `min`: The data field must have a minimum length.
-   `same`: The data field must match another data field.
-   `regex`: The data field must match a specific format.

## CDN

You can use the Form Validator library by including the following script tag in your web page:

```
<script src="https://dangtu2212.github.io/js.form-validation/validator.js"></script>
```

## Usage

To use the Form Validator library, follow these steps:

-   Step 1: Include the library in your web page:

```
<script src="https://dangtu2212.github.io/js.form-validation/validator.js"></script>
```

-   Step 2: Define the data fields and validation rules in your form:

```
<form id="form-1">
    <!-- Input default -->
    <div class="form-group">
        <input name="fullname" />
        <span class="form-message"></span>
    </div>

    <!-- Input invalid -->
    <div class="form-group invalid">
        <input name="fullname" />
        <span class="form-message"></span>
    </div>

    <!-- Select -->
    <div class="form-group">
        <select name="province">
            <option value="">-- Chọn Tỉnh/Thành --</option>
            <option value="hni">Hà nội</option>
            <option value="dng">Đà Nẵng</option>
        </select>
        <span class="form-message"></span>
    </div>

    <!-- Checkbox -->
    <div class="form-group">
        <div>
            <input type="checkbox" value="math" name="favorite_subject" />
            <input type="checkbox" value="chemistry" name="favorite_subject" />
        </div>
        <span class="form-message"></span>
    </div>

    <!-- Radio -->
    <div class="form-group">
        <div>
            <input type="radio" value="male" name="gender" />
            <input type="radio" value="female" name="gender" />
        </div>
        <span class="form-message"></span>
    </div>
</form>
```

-   Step 3: Declare input variables for the Validator():

```
const formSelector = "#form-1";
const itemsValidate = {
    fullname: "isRequired",
    email: "isRequired | email",
    phone_number: "isRequired | regex:/^\\d{10,15}$/",
    password: "isRequired | min:8",
    password_confirmation: "isRequired | same:password",
};
const errorMessages = {
    "fullname.isRequired": "Please enter your full name",
    "email.isRequired": "Please enter your email",
    "email.email": "Please enter a valid email address",
    "phone_number.isRequired": "Please enter your phone number",
    "phone_number.regex": "Please enter a valid phone number",
    "password.isRequired":"Please enter a password",
    "password.min": "Password must be at least 8 characters long",
    "password_confirmation.isRequired": "Please enter password confirmation",
    "password_confirmation.same": "Password confirmation must match the password",
};
const formGroupSelector = ".form-group";
const messageSelector = ".form-message";
const onSubmit = (formValue) => {
    console.log(formValue);
};
```

Bước 4: Step 4: Use the Validator():

```
Validator(formSelector, itemsValidate, errorMessages, formGroupSelector, messageSelector, onSubmit);
```

## Demo

You can see a live demo of the Form Validator library [here](https://dangtu2212.github.io/js.form-validation).

## Contribution

If you find any issues or have suggestions for improvement, please create an issue in the [GitHub repository](https://github.com/dangtu2212/js.form-validation/issues)
