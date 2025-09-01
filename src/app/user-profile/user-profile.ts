import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h2>User Profile</h2>
      </div>
      <div class="profile-content">
        <p>User information goes here</p>
      </div>
    </div>
  `,
  styles: [
    `
    .profile-container {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin: 1rem;
    }
    `,
    `
    .profile-header {
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
    
    .profile-header h2 {
      color: #495057;
      margin: 0;
    }
    `,
    `
    .profile-content {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #6c757d;
    }
    `
  ]
})
export class UserProfileComponent {
}