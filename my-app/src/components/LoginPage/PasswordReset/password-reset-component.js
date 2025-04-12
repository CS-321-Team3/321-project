import React from "react";

export default function PasswordReset({ foundUsername, credentials, onCredentialChange, onSubmit}) {
    /**
     * change your password. enter in either username or email into one textbox.
     * if recognized, then show a new textbox with new password
     * update new password in python
     */
    if (foundUsername) {
        return (
            <div className="password-reset">
                <div className="form-group">
                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={onCredentialChange}
                    required
                    />
                </div>
            </div>
        );    
    } else {
        
    }
    
}