# Feature plans

## Backend and operation

- [x] Global backend/operation

  - [x] Hosting, Domain
    - [x] Github page
      - [x] Github Action
  
  - [x] Data storage and query
    - [x] Google Cloud
      - [x] CORS server
      - [x] Google APIs
    - [x] Image storage and query
      - [x] Imgur API

  - [x] Account, Authentication
    - [x] Google Oauth 2.0
      - [x] Google APIs
    - [ ] Bans/blacklist
      - [ ] Email bans
      - [ ] IP bans
      - [ ] Address bans

  - [ ] Security and secrete
    - [ ] Hidden APIs/Credential (GitHub page has limited secure tools to hide secrets)
    - [x] Report vulnerability channel
      - [x] GitHub Issue/Security
    - [ ] DDOS prevention (Please don't drain my bank account)
    - [ ] Middle man attack
    - [ ] Payload injection

  - [ ] Wiki
    - [ ] GitHub Wiki
    - [ ] Code documentation
    - [ ] Code comment
    - [x] Plans
      - [x] Structure plans
      - [x] Feature plans
    - [x] Bug/Issue Documentation
      - [x] GitHub Issue

## Frontend

- [ ] Sidebar
- [ ] Domain login/out
- [ ] Navigation
  - [ ] Navigation Bar
  - [ ] Local navigation (Navigation inside the domain doesn't refresh the previous page)
- [ ] Ads/premium features
- [ ] Logo
   
### Renter

- [ ] Global renter
  - [ ] Renter authentication
  
  - [ ] Landing page [ ] mobile compatibility

    - [x] Listing page [ ] mobile compatibility
      - [x] Listing property
        - [x] Filer
        - [x] Sort
        - [x] ID
        - [x] Info
        - [x] Status
          - [x] Color-coded
  
        - [x] Rental Detail [ ] mobile compatibility
          - [x] Info
          - [x] Map
            - [x] Google map API
          - [x] Images
            - [x] Images carousel
          - [x] Local navigation (Navigation inside the domain doesn't refresh the previous page)
          - [ ] Detail Status
            - [ ] Rented until
          - [ ] Call to action
            - [ ] Email
            - [ ] Phone
            - [ ] Text
            - [ ] Rent now
              - [ ] Calendar

### Host
    
- [ ] Global renter
  - [ ] Host authentication
     
  - [x] Submit rental [x] mobile compatibility
    - [x] Email authentication
      - [x] Google Oauth 2.0
    - [x] Image submission
      - [x] Imgur API
     
  - [x] manage rental [x] mobile compatibility
    - [x] Email authentication
      - [x] Google Oauth 2.0
    - [x] Active date status update
    - [x] Rented status update
      - [ ] Calendar
    - [ ] Edit rental detail
