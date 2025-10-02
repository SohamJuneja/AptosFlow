// This is the core smart contract for AptosFlow.
// It defines the data structures and logic for creating and executing workflows.
module aptosflow_addr::workflow {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::table::{Self, Table};
    use aptos_framework::event;
    use aptos_framework::account;

    // ==============
    // === Errors ===
    // ==============
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_WORKFLOW_NOT_FOUND: u64 = 2;

    // ===================
    // === Data Structs ===
    // ===================
    struct Workflow has store, key {
        id: u64,
        owner: address,
        trigger_description: String,
        action_description: String,
        action_params: vector<u8>,
    }

    struct WorkflowStore has key {
        workflows: Table<u64, Workflow>,
        workflow_counter: u64,
        create_event_handle: event::EventHandle<CreateWorkflowEvent>,
        execute_event_handle: event::EventHandle<ExecuteWorkflowEvent>,
    }

    // =============
    // === Events ===
    // =============
    struct CreateWorkflowEvent has drop, store {
        id: u64,
        owner: address,
        trigger: String,
        action: String,
    }

    struct ExecuteWorkflowEvent has drop, store {
        id: u64,
        executor: address,
        status: String,
    }

    // ========================
    // === Public Functions ===
    // ========================
    fun init_module(sender: &signer) {
        let addr = signer::address_of(sender);
        assert!(addr == @aptosflow_addr, E_NOT_AUTHORIZED);

        move_to(sender, WorkflowStore {
            workflows: table::new(),
            workflow_counter: 0,
            create_event_handle: account::new_event_handle<CreateWorkflowEvent>(sender),
            execute_event_handle: account::new_event_handle<ExecuteWorkflowEvent>(sender),
        });
    }

    public entry fun create_workflow(
        sender: &signer,
        trigger_description: String,
        action_description: String,
        action_params: vector<u8>
    ) acquires WorkflowStore {
        let sender_addr = signer::address_of(sender);
        let store = borrow_global_mut<WorkflowStore>(@aptosflow_addr);

        let new_id = store.workflow_counter;
        store.workflow_counter = new_id + 1;

        let new_workflow = Workflow {
            id: new_id,
            owner: sender_addr,
            trigger_description,
            action_description,
            action_params,
        };

        table::add(&mut store.workflows, new_id, new_workflow);

        event::emit_event(
            &mut store.create_event_handle,
            CreateWorkflowEvent {
                id: new_id,
                owner: sender_addr,
                trigger: trigger_description,
                action: action_description,
            },
        );
    }

    public entry fun execute_workflow(
        admin_signer: &signer,
        workflow_id: u64
    ) acquires WorkflowStore {
        let executor_addr = signer::address_of(admin_signer);
        assert!(executor_addr == @aptosflow_addr, E_NOT_AUTHORIZED);

        let store = borrow_global_mut<WorkflowStore>(@aptosflow_addr);
        assert!(table::contains(&store.workflows, workflow_id), E_WORKFLOW_NOT_FOUND);

        let _workflow = table::borrow(&store.workflows, workflow_id);

        event::emit_event(
            &mut store.execute_event_handle,
            ExecuteWorkflowEvent {
                id: workflow_id,
                executor: executor_addr,
                status: string::utf8(b"Successfully Executed Placeholder Action"),
            },
        );
    }
}